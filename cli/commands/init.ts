import * as fs from 'fs';
import * as path from 'path';
import simpleGit from 'simple-git';

/**
 * Install git post-commit hook
 */
export async function initCommand(): Promise<void> {
  try {
    const git = simpleGit(process.cwd());
    
    // Check if current directory is a git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.error('Error: Not a git repository. Please run this command from within a git repository.');
      process.exit(1);
    }

    // Get the git directory path
    const gitDir = await git.revparse(['--git-dir']);
    const hooksDir = path.join(process.cwd(), gitDir.trim(), 'hooks');
    const hookPath = path.join(hooksDir, 'post-commit');

    // Ensure hooks directory exists
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Check if hook already exists
    if (fs.existsSync(hookPath)) {
      const existingContent = fs.readFileSync(hookPath, 'utf-8');
      if (existingContent.includes('asyncpair capture')) {
        console.log('✓ AsyncPair post-commit hook is already installed.');
        return;
      }
      
      // Backup existing hook
      const backupPath = `${hookPath}.backup-${Date.now()}`;
      fs.copyFileSync(hookPath, backupPath);
      console.log(`⚠ Existing post-commit hook backed up to: ${path.basename(backupPath)}`);
    }

    // Create the hook script
    const hookScript = `#!/bin/sh
# AsyncPair post-commit hook
# Automatically capture handoffs after each commit

# Run asyncpair capture in the background to avoid blocking the commit
# Redirect output to avoid cluttering the terminal
(asyncpair capture --skip-questions > /dev/null 2>&1 &)

# Made with Bob
`;

    // Write the hook
    fs.writeFileSync(hookPath, hookScript, { mode: 0o755 });
    
    console.log('✓ AsyncPair post-commit hook installed successfully!');
    console.log('');
    console.log('The hook will automatically capture handoffs after each commit.');
    console.log('To capture a handoff manually with questions, run: asyncpair capture');
    
  } catch (error) {
    console.error('Error installing post-commit hook:', error);
    process.exit(1);
  }
}

// Made with Bob