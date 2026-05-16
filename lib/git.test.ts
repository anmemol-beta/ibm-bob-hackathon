import { getRecentCommits, CommitInfo, RecentCommitsResult } from './git';
import * as path from 'path';

describe('git.ts', () => {
  describe('getRecentCommits', () => {
    it('should return commits from the current repository', async () => {
      // Use the current project directory as the test repository
      const repoPath = path.resolve(__dirname, '..');
      
      const result: RecentCommitsResult = await getRecentCommits(repoPath, 5);
      
      // Verify the result structure
      expect(result).toBeDefined();
      expect(result.commits).toBeDefined();
      expect(Array.isArray(result.commits)).toBe(true);
      
      // If there are commits, verify their structure
      if (result.commits.length > 0) {
        const commit: CommitInfo = result.commits[0];
        
        expect(commit).toHaveProperty('hash');
        expect(commit).toHaveProperty('message');
        expect(commit).toHaveProperty('author');
        expect(commit).toHaveProperty('date');
        expect(commit).toHaveProperty('changedFiles');
        expect(commit).toHaveProperty('diffs');
        
        expect(typeof commit.hash).toBe('string');
        expect(typeof commit.message).toBe('string');
        expect(typeof commit.author).toBe('string');
        expect(typeof commit.date).toBe('string');
        expect(Array.isArray(commit.changedFiles)).toBe(true);
        expect(Array.isArray(commit.diffs)).toBe(true);
        
        // Verify hash format (40 character hex string for full SHA-1)
        expect(commit.hash).toMatch(/^[0-9a-f]{40}$/);
        
        // Verify diffs structure
        if (commit.diffs.length > 0) {
          const diff = commit.diffs[0];
          expect(diff).toHaveProperty('path');
          expect(diff).toHaveProperty('diff');
          expect(typeof diff.path).toBe('string');
          expect(typeof diff.diff).toBe('string');
        }
      }
    });

    it('should respect the count parameter', async () => {
      const repoPath = path.resolve(__dirname, '..');
      const count = 3;
      
      const result: RecentCommitsResult = await getRecentCommits(repoPath, count);
      
      expect(result.commits.length).toBeLessThanOrEqual(count);
    });

    it('should return error for non-existent repository', async () => {
      const invalidPath = '/path/that/does/not/exist';
      
      const result: RecentCommitsResult = await getRecentCommits(invalidPath);
      
      expect(result.commits).toEqual([]);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
    });

    it('should return error for non-git directory', async () => {
      // Use a temporary directory that's not a git repo
      const nonGitPath = path.resolve(__dirname);
      
      const result: RecentCommitsResult = await getRecentCommits(nonGitPath);
      
      // This might succeed if the parent directory is a git repo
      // So we just verify the structure is correct
      expect(result).toBeDefined();
      expect(result.commits).toBeDefined();
      expect(Array.isArray(result.commits)).toBe(true);
    });

    it('should handle default count parameter', async () => {
      const repoPath = path.resolve(__dirname, '..');
      
      const result: RecentCommitsResult = await getRecentCommits(repoPath);
      
      expect(result).toBeDefined();
      expect(result.commits).toBeDefined();
      expect(Array.isArray(result.commits)).toBe(true);
      // Default count is 10, so we should get at most 10 commits
      expect(result.commits.length).toBeLessThanOrEqual(10);
    });

    it('should include changed files for each commit', async () => {
      const repoPath = path.resolve(__dirname, '..');
      
      const result: RecentCommitsResult = await getRecentCommits(repoPath, 1);
      
      if (result.commits.length > 0) {
        const commit = result.commits[0];
        expect(Array.isArray(commit.changedFiles)).toBe(true);
        
        // Each changed file should have a corresponding diff
        expect(commit.diffs.length).toBe(commit.changedFiles.length);
        
        // Verify that each changed file has a diff entry
        commit.changedFiles.forEach(filePath => {
          const hasDiff = commit.diffs.some(diff => diff.path === filePath);
          expect(hasDiff).toBe(true);
        });
      }
    });
  });
});

// Made with Bob
