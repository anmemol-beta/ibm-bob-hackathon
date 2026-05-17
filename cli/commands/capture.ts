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
 * Ask a question in the terminal with a timeout
 */
function askQuestion(question: string, timeoutMs: number = 10000): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const timeout = setTimeout(() => {
      rl.close();
      resolve('');
    }, timeoutMs);

    rl.question(question, (answer) => {
      clearTimeout(timeout);
      rl.close();
      resolve(answer.trim());
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
      console.log('');
      
      // Question 1: Hidden risks — stubs, hacks, unsafe code
      contextNotes = await askQuestion(
        'Anything stubbed, hardcoded, or unsafe the next dev should know about? [Enter to skip]: ',
        15000
      );

      // Question 2: The next concrete task and where it lives
      if (contextNotes || true) {
        developerNotes = await askQuestion(
          'What should the next developer do first, and where in the code? [Enter to skip]: ',
          15000
        );
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