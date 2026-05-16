#!/usr/bin/env node

/**
 * AsyncPair CLI
 * Command-line tool for capturing handoffs from git commits
 */

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { captureCommand } from './commands/capture';

const program = new Command();

program
  .name('asyncpair')
  .description('AsyncPair - Async pair programming handoff tool')
  .version('0.1.0');

program
  .command('init')
  .description('Install git post-commit hook in the current repository')
  .action(initCommand);

program
  .command('capture')
  .description('Capture a handoff from the most recent commit')
  .option('-s, --skip-questions', 'Skip interactive questions')
  .action(captureCommand);

program.parse(process.argv);

// Made with Bob