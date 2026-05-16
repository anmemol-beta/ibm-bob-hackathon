import simpleGit, { SimpleGit, DefaultLogFields, DiffResult } from 'simple-git';

/**
 * Represents a file change in a commit
 */
export interface FileChange {
  path: string;
  diff: string;
}

/**
 * Represents a git commit with its details
 */
export interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  date: string;
  changedFiles: string[];
  diffs: FileChange[];
}

/**
 * Result interface for getRecentCommits function
 */
export interface RecentCommitsResult {
  commits: CommitInfo[];
  error?: string;
}

/**
 * Retrieves recent commits from a local git repository
 * 
 * @param repoPath - Path to the local git repository
 * @param count - Number of recent commits to retrieve (default: 10)
 * @returns Promise with recent commits information
 */
export async function getRecentCommits(
  repoPath: string,
  count: number = 10
): Promise<RecentCommitsResult> {
  try {
    const git: SimpleGit = simpleGit(repoPath);

    // Check if the directory is a git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return {
        commits: [],
        error: `Path ${repoPath} is not a git repository`
      };
    }

    // Get recent commits
    const log = await git.log({ maxCount: count });

    // Process each commit to get detailed information
    const commits: CommitInfo[] = await Promise.all(
      log.all.map(async (commit: DefaultLogFields) => {
        // Get the list of changed files for this commit
        const diffSummary = await git.diffSummary([`${commit.hash}^`, commit.hash]);
        const changedFiles = diffSummary.files.map(file => file.file);

        // Get diffs for each changed file
        const diffs: FileChange[] = await Promise.all(
          changedFiles.map(async (filePath: string) => {
            try {
              const diff: string = await git.diff([`${commit.hash}^`, commit.hash, '--', filePath]);
              return {
                path: filePath,
                diff: diff
              };
            } catch (error) {
              // Handle cases where file might not exist in parent commit (new files)
              const diff: string = await git.show([`${commit.hash}:${filePath}`])
                .catch(() => '');
              return {
                path: filePath,
                diff: diff || `New file: ${filePath}`
              };
            }
          })
        );

        return {
          hash: commit.hash,
          message: commit.message,
          author: commit.author_name,
          date: commit.date,
          changedFiles,
          diffs
        };
      })
    );

    return {
      commits
    };
  } catch (error) {
    return {
      commits: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Made with Bob
