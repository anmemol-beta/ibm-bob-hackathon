import * as readline from 'readline';
import simpleGit from 'simple-git';
import { getRecentCommits, CommitInfo } from '../../lib/git';
import { generate } from '../../lib/llm';
import { addHandoff } from '../../lib/store';
import { Handoff, HandoffScenario } from '../../lib/types';

interface CaptureOptions {
  skipQuestions?: boolean;
}

/**
 * Ask a single question on a shared readline interface. Resolves with the
 * trimmed answer, or '' if stdin ends (EOF) before an answer is given.
 */
function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    let answered = false;
    rl.question(question, (answer) => {
      answered = true;
      resolve(answer.trim());
    });
    rl.once('close', () => {
      if (!answered) resolve('');
    });
  });
}

/**
 * Generate handoff scenarios from commit information
 */
async function generateHandoffScenarios(commit: CommitInfo, developerNotes: string): Promise<HandoffScenario[]> {
  try {
    // Build a prompt for the LLM
    const prompt = `You are helping create a handoff note for async pair programming.

Commit: ${commit.message}
Author: ${commit.author}
Files changed: ${commit.changedFiles.join(', ')}
Developer notes: ${developerNotes || 'None provided'}

Generate 2-3 brief scenarios that describe what the next developer might work on. Each scenario should be 1-2 sentences.
Format your response as a JSON array of objects with "id", "situation", and "suggestedApproach" fields.

Example:
[
  {
    "id": "scenario-1",
    "situation": "The authentication flow needs testing",
    "suggestedApproach": "Add unit tests for the login and logout functions"
  }
]`;

    const response = await generate(prompt);
    
    // Try to parse JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const scenarios = JSON.parse(jsonMatch[0]);
      return scenarios.map((s: any, i: number) => ({
        id: s.id || `scenario-${i + 1}`,
        situation: s.situation || 'Continue development',
        suggestedApproach: s.suggestedApproach || 'Review and extend the changes'
      }));
    }
    
    // Fallback if parsing fails
    return [
      {
        id: 'scenario-1',
        situation: `Continue work on: ${commit.message}`,
        suggestedApproach: 'Review the changes and add tests or documentation as needed'
      }
    ];
  } catch (error) {
    console.warn('Failed to generate scenarios with LLM, using fallback');
    return [
      {
        id: 'scenario-1',
        situation: `Continue work on: ${commit.message}`,
        suggestedApproach: 'Review the changes and extend functionality'
      }
    ];
  }
}

/**
 * Ask the LLM for two handoff questions tailored to this specific commit, so the
 * developer is prompted about what actually changed instead of generic boilerplate.
 * Falls back to fixed questions if generation fails — mirroring how
 * generateHandoffScenarios degrades when no LLM is configured.
 */
async function generateCommitQuestions(commit: CommitInfo): Promise<[string, string]> {
  const fallback: [string, string] = [
    'Anything stubbed, hardcoded, or unsafe the next dev should know about?',
    'What should the next developer do first, and where in the code?',
  ];

  try {
    const prompt = `You are preparing a developer handoff for async pair programming.
Based only on the commit below, write exactly 2 short questions to ask the developer.
Each question must be specific to this commit — name the actual feature, file, or endpoint that changed.
Question 1: surface hidden risk — stubbed, hardcoded, placeholder, or unsafe code; anything that looks done but is not.
Question 2: pin down the single most important next task and where in the code it lives.
Keep each question under 22 words. No preamble, no numbering.

Commit message: ${commit.message}
Files changed: ${commit.changedFiles.join(', ') || 'unknown'}

Return ONLY a JSON array of exactly 2 strings.`;

    const response = await generate(prompt);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (
        Array.isArray(parsed) &&
        parsed.length >= 2 &&
        typeof parsed[0] === 'string' &&
        typeof parsed[1] === 'string' &&
        parsed[0].trim() &&
        parsed[1].trim()
      ) {
        return [parsed[0].trim(), parsed[1].trim()];
      }
    }
    return fallback;
  } catch (error) {
    console.warn('Could not generate commit-specific questions, using defaults');
    return fallback;
  }
}

/**
 * Capture a handoff from the most recent commit
 */
export async function captureCommand(options: CaptureOptions): Promise<void> {
  try {
    const repoPath = process.cwd();
    const git = simpleGit(repoPath);
    
    // Check if current directory is a git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.error('Error: Not a git repository.');
      process.exit(1);
    }

    // Get the most recent commit
    const result = await getRecentCommits(repoPath, 1);
    
    if (result.error || result.commits.length === 0) {
      console.error('Error: Could not retrieve recent commits.');
      process.exit(1);
    }

    const commit = result.commits[0];
    
    // Get branch name
    const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
    
    let developerNotes = '';
    let contextNotes = '';
    
    // Ask questions if not skipped
    if (!options.skipQuestions) {
      console.log(`\n📝 Capturing handoff for commit: ${commit.message.substring(0, 60)}${commit.message.length > 60 ? '...' : ''}`);

      // Tailor the two questions to what this specific commit changed.
      console.log('🔍 Reading the commit to tailor the questions...');
      const [question1, question2] = await generateCommitQuestions(commit);
      console.log('');

      // One shared readline interface for both questions — recreating it per
      // question drops piped input and can leave stdin unresponsive.
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      try {
        // Question 1 surfaces hidden risk; question 2 pins down the next task.
        contextNotes = await askQuestion(rl, `${question1} [Enter to skip]: `);
        developerNotes = await askQuestion(rl, `${question2} [Enter to skip]: `);
      } finally {
        rl.close();
      }
    }
    
    // Combine notes
    const combinedNotes = [contextNotes, developerNotes].filter(n => n).join(' | ');
    
    // Generate scenarios
    console.log('Generating handoff scenarios...');
    const scenarios = await generateHandoffScenarios(commit, combinedNotes);
    
    // Create handoff
    const handoff: Handoff = {
      id: `handoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: commit.author,
      timestamp: new Date(),
      gitActivitySummary: `${commit.message}\n\nFiles: ${commit.changedFiles.join(', ')}`,
      scenarios,
      metadata: {
        repoPath,
        branch: branch.trim(),
        commitCount: 1,
        developerNotes: combinedNotes || 'No additional notes'
      },
      status: 'pending'
    };
    
    // Save handoff
    addHandoff(handoff);
    
    console.log('✓ Handoff captured successfully!');
    console.log(`  ID: ${handoff.id}`);
    console.log(`  Scenarios: ${scenarios.length}`);
    
  } catch (error) {
    // Fail silently if called from git hook to avoid blocking commits
    if (options.skipQuestions) {
      console.error('AsyncPair capture failed (non-blocking):', error);
      process.exit(0);
    } else {
      console.error('Error capturing handoff:', error);
      process.exit(1);
    }
  }
}

// Made with Bob