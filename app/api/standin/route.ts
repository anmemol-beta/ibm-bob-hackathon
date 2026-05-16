import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/llm";
import { getRecentCommits } from "@/lib/git";
import { getHandoff } from "@/lib/store";
import type { StandinChatRequest, StandinChatResponse } from "@/lib/types";

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
    
    // 3. Build the prompt for the LLM
    const prompt = `You are acting as a stand-in for a developer who is currently away. Based on their recent work and handoff notes, answer the following question as they would.

${context}

# Question from Working Developer
${question}

# Instructions
- Answer as if you are the absent developer
- Reference specific commits, files, or scenarios from the context when relevant
- Be helpful and provide actionable guidance
- If you don't have enough context, say so and suggest what information would help
- Keep your response concise but informative

# Answer`;

    // 4. Call the LLM to generate the response
    const answer = await generate(prompt);
    
    // 5. Create response
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
