#!/usr/bin/env node
/**
 * @fileoverview Enforces AGENTS.md as this fork's canonical agent protocol.
 *
 * Requires a nonempty root AGENTS.md and rejects a duplicate root CLAUDE.md.
 * Upstream framework documentation and templates retain their own filenames.
 * Runs in devcheck; the script name remains stable for existing callers.
 *
 * @module scripts/check-docs-sync
 */

import { readdir, readFile } from 'node:fs/promises';
import process from 'node:process';

const files = new Set(await readdir('.'));
let valid = true;

if (!files.has('AGENTS.md')) {
  console.error('Missing AGENTS.md. Restore the canonical repository agent protocol.');
  valid = false;
} else if (!(await readFile('AGENTS.md', 'utf8')).trim()) {
  console.error('AGENTS.md is empty. Restore the repository agent protocol.');
  valid = false;
}

if (files.has('CLAUDE.md')) {
  console.error(
    'Root CLAUDE.md duplicates the agent protocol. Move its instructions into AGENTS.md and remove it.',
  );
  valid = false;
}

if (valid) console.log('AGENTS.md is the canonical repository agent protocol.');

process.exit(valid ? 0 : 1);
