import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/llm";
import { getRecentCommits, type CommitInfo } from "@/lib/git";
import { getHandoff } from "@/lib/store";
import type { StandinChatRequest, StandinChatResponse } from "@/lib/types";
import mockCommitsData from "@/data/mock-commits.json";

/**
 * POST /api/standin
 * Chat endpoint for AI standin - answers questions as the absent teammate would
 */
export async function POST(request: NextRequest) {
  try {
    const body: StandinChatRequest = await request.json();
    const { question, handoffId, repoPath } = body;
    
    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }
    
    // Build context from repo and handoff data
    let context = "";
    
    // 1. Get handoff context if handoffId provided
    if (handoffId) {
      const handoff = getHandoff(handoffId);
      if (handoff) {
        context += `# Handoff Context\n`;
        context += `Author: ${handoff.author}\n`;
        context += `Date: ${new Date(handoff.timestamp).toLocaleString()}\n\n`;
        context += `## Git Activity Summary\n${handoff.gitActivitySummary}\n\n`;
        context += `## Developer Notes\n${handoff.metadata.developerNotes}\n\n`;
        
        if (handoff.scenarios && handoff.scenarios.length > 0) {
          context += `## Scenarios\n`;
          handoff.scenarios.forEach((scenario, idx) => {
            context += `### Scenario ${idx + 1}\n`;
            context += `**Situation:** ${scenario.situation}\n`;
            context += `**Suggested Approach:** ${scenario.suggestedApproach}\n\n`;
          });
        }
      }
    }
    
    // 2. Get recent repo activity if repoPath provided
    if (repoPath) {
      try {
        const { commits, error } = await getRecentCommits(repoPath, 5);
        if (!error && commits.length > 0) {
          context += `# Recent Repository Activity\n`;
          commits.forEach((commit) => {
            context += `\n## Commit: ${commit.message}\n`;
            context += `Author: ${commit.author}\n`;
            context += `Date: ${commit.date}\n`;
            context += `Files changed: ${commit.changedFiles.join(", ")}\n`;
            
            // Include diffs for context (truncated for brevity)
            commit.diffs.forEach((diff) => {
              const truncatedDiff = diff.diff.length > 500 
                ? diff.diff.substring(0, 500) + "...[truncated]"
                : diff.diff;
              context += `\n### ${diff.path}\n\`\`\`\n${truncatedDiff}\n\`\`\`\n`;
            });
          });
        }
      } catch (error) {
        console.warn("Failed to get repo commits:", error);
      }
    }
    
    // 3. Get commits from reference repositories if available
    if (handoffId) {
      const handoff = getHandoff(handoffId);
      if (handoff?.metadata.referenceRepos && handoff.metadata.referenceRepos.length > 0) {
        context += `# Author's History in Other Repositories\n`;
        context += `The following commits show ${handoff.author}'s work patterns and conventions across other projects:\n\n`;
        
        const COMMITS_PER_REPO = 3;
        const MAX_DIFF_LENGTH = 400;
        
        for (const refRepoPath of handoff.metadata.referenceRepos) {
          try {
            let commits: CommitInfo[] = [];
            let usedMockData = false;
            
            // Try to get real git commits first
            const { commits: gitCommits, error } = await getRecentCommits(refRepoPath, 10);
            
            if (error || gitCommits.length === 0) {
              // Fall back to mock commits if real git fails
              const mockCommits = (mockCommitsData as Record<string, CommitInfo[]>)[refRepoPath];
              
              if (mockCommits && mockCommits.length > 0) {
                commits = mockCommits;
                usedMockData = true;
                console.log(`Using mock commits for reference repo: ${refRepoPath}`);
              } else {
                if (error) {
                  console.warn(`Failed to fetch commits from reference repo ${refRepoPath}:`, error);
                } else {
                  console.warn(`No commits found in reference repo: ${refRepoPath}`);
                }
                continue;
              }
            } else {
              commits = gitCommits;
            }
            
            // Filter commits by handoff author, fallback to recent commits
            let relevantCommits = commits.filter(c =>
              c.author.toLowerCase().includes(handoff.author.toLowerCase()) ||
              handoff.author.toLowerCase().includes(c.author.toLowerCase())
            );
            
            // If no commits by author, use most recent commits
            if (relevantCommits.length === 0) {
              relevantCommits = commits;
              context += `## Repository: ${refRepoPath}${usedMockData ? ' (mock data)' : ''}\n`;
              context += `*Note: No commits by ${handoff.author} found, showing recent commits instead*\n\n`;
            } else {
              context += `## Repository: ${refRepoPath}${usedMockData ? ' (mock data)' : ''}\n`;
              context += `*Commits by ${handoff.author}*\n\n`;
            }
            
            // Limit to COMMITS_PER_REPO
            const commitsToInclude = relevantCommits.slice(0, COMMITS_PER_REPO);
            
            commitsToInclude.forEach((commit) => {
              context += `### ${commit.message}\n`;
              context += `Author: ${commit.author} | Date: ${commit.date}\n`;
              context += `Files: ${commit.changedFiles.join(", ")}\n`;
              
              // Include truncated diffs
              if (commit.diffs.length > 0) {
                commit.diffs.slice(0, 2).forEach((diff) => {
                  const truncatedDiff = diff.diff.length > MAX_DIFF_LENGTH
                    ? diff.diff.substring(0, MAX_DIFF_LENGTH) + "...[truncated]"
                    : diff.diff;
                  context += `\n**${diff.path}**\n\`\`\`\n${truncatedDiff}\n\`\`\`\n`;
                });
              }
              context += `\n`;
            });
            
          } catch (error) {
            console.warn(`Error processing reference repo ${refRepoPath}:`, error);
            // Continue with next repo, don't crash
          }
        }
      }
    }
    
    // 4. Build the prompt for the LLM
    const prompt = `You are acting as a stand-in for a developer who is currently away. Based on their recent work and handoff notes, answer the following question as they would.

${context}

# Question from Working Developer
${question}

# Instructions
- Answer as if you are the absent developer
- Reference specific commits, files, or scenarios from the context when relevant
- When the handoff and scenarios do not directly cover the question, use the author's history in other repositories to infer their patterns, conventions, and past decisions
- Be helpful and provide actionable guidance
- If you don't have enough context, say so and suggest what information would help
- Keep your response concise but informative

# Answer`;

    // 5. Call the LLM to generate the response
    const answer = await generate(prompt);
    
    // 6. Create response
    const response: StandinChatResponse = {
      answer: answer,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Standin chat error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Made with Bob
