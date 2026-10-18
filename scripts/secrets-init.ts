#!/usr/bin/env bun
/**
 * @fileoverview Reuse or create an external age identity and initialize an empty
 * fnox age recipient list. Existing recipients and ciphertext are never rewritten.
 * @module scripts/secrets-init
 */

import { execFile } from 'node:child_process';
import { chmod, lstat, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { TOML } from 'bun';

const exec = promisify(execFile);
class SetupError extends Error {}

/** Resolve symlinked ancestors even when the final key file does not yet exist. */
async function canonicalPath(path: string): Promise<string> {
  try {
    return await realpath(path);
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
    const parent = dirname(path);
    if (parent === path) throw error;
    return join(await canonicalPath(parent), basename(path));
  }
}

function expandHome(path: string) {
  return path === '~' ? homedir() : path.startsWith('~/') ? join(homedir(), path.slice(2)) : path;
}

function ageRecipients(text: string): string[] {
  const config = TOML.parse(text);
  const provider = config.providers?.age;
  if (
    provider?.type !== 'age' ||
    !Array.isArray(provider.recipients) ||
    provider.recipients.some((recipient: unknown) => typeof recipient !== 'string')
  ) {
    throw new SetupError('Declare [providers.age] with type = "age" and a recipients array first.');
  }
  if (provider.recipients.length === 0 && hasSecrets(config)) {
    throw new SetupError(
      'Restore the original recipients before initializing a config containing secrets.',
    );
  }
  return provider.recipients;
}

function hasSecrets(config: Record<string, unknown>): boolean {
  if (config.secrets && Object.keys(config.secrets).length > 0) return true;
  return Object.values(config.profiles ?? {}).some((profile) =>
    hasSecrets(profile as Record<string, unknown>),
  );
}

/** Only edit the empty declaration styles this repository supports, retaining comments. */
function registerRecipients(text: string, recipients: string[]) {
  const replacement = `recipients = ${JSON.stringify(recipients)}`;
  let updated = text.replace(
    /(^\[providers\.age\][^\n]*\n)([\s\S]*?)(?=^\[|$(?![\s\S]))/m,
    (_match, heading: string, body: string) =>
      heading + body.replace(/^\s*recipients\s*=\s*\[\s*\]/m, replacement),
  );
  if (updated === text) {
    updated = text.replace(
      /(^\[providers\][^\n]*\n)([\s\S]*?)(?=^\[|$(?![\s\S]))/m,
      (_match, heading: string, body: string) =>
        heading +
        body.replace(/^(age\s*=\s*\{[^\n]*?)recipients\s*=\s*\[\s*\]/m, `$1${replacement}`),
    );
  }
  if (updated === text || JSON.stringify(ageRecipients(updated)) !== JSON.stringify(recipients)) {
    throw new SetupError(
      'Unable to locate an empty age recipients declaration; configuration unchanged.',
    );
  }
  return updated;
}

async function initialize() {
  const root = await realpath(process.cwd());
  const configPath = join(root, 'fnox.toml');
  const text = await readFile(configPath, 'utf8');
  const recipients = ageRecipients(text);
  const configDir =
    process.env.FNOX_CONFIG_DIR ||
    join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'fnox');
  const requestedPath = resolve(
    expandHome(process.env.FNOX_AGE_KEY_FILE || join(configDir, 'age.txt')),
  );
  const keyPath = await canonicalPath(requestedPath);
  const fromRoot = relative(root, keyPath);
  if (
    fromRoot === '' ||
    (!isAbsolute(fromRoot) && fromRoot !== '..' && !fromRoot.startsWith('../'))
  ) {
    throw new SetupError('The private age identity must be outside this repository.');
  }

  let exists = false;
  try {
    const metadata = await lstat(keyPath);
    if (!metadata.isFile()) throw new SetupError('The age identity path must be a regular file.');
    exists = true;
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
  }

  if (!exists) {
    const previousMask = process.umask(0o077);
    try {
      await mkdir(dirname(keyPath), { recursive: true, mode: 0o700 });
      await exec('age-keygen', ['-o', keyPath]);
    } finally {
      process.umask(previousMask);
    }
    console.log('Created an age identity outside the repository; back it up securely.');
  }
  if (((await lstat(keyPath)).mode & 0o777) !== 0o600) await chmod(keyPath, 0o600);
  const { stdout } = await exec('age-keygen', ['-y', keyPath]);
  const publicKeys = stdout.trim().split(/\r?\n/);
  if (!publicKeys.every((key) => /^age1[a-z0-9]+$/.test(key))) {
    throw new SetupError('age-keygen did not return supported public age recipients.');
  }

  if (publicKeys.some((key) => recipients.includes(key))) {
    console.log('The existing age identity is already registered; fnox.toml is unchanged.');
  } else if (recipients.length > 0) {
    console.log(`Public recipient(s):\n${publicKeys.join('\n')}`);
    throw new SetupError(
      'Existing recipients preserved. Restore the matching identity, or have an existing key holder add the new public recipient and run fnox reencrypt --provider age.',
    );
  } else {
    await writeFile(configPath, registerRecipients(text, publicKeys));
    console.log('Registered public age recipients in fnox.toml.');
  }
  console.log('Add secrets with hidden input: fnox set COURTLISTENER_API_TOKEN --provider age');
}

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--help') {
  console.log('Usage: mise run secrets:init');
  console.log('Uses FNOX_AGE_KEY_FILE, FNOX_CONFIG_DIR/age.txt, or XDG_CONFIG_HOME/fnox/age.txt.');
} else if (args.length > 0) {
  console.error('Usage: mise run secrets:init');
  process.exitCode = 2;
} else {
  try {
    await initialize();
  } catch (error) {
    // Filesystem, TOML, and subprocess errors can embed private contents.
    console.error(
      error instanceof SetupError
        ? error.message
        : 'Secret initialization failed; check fnox.toml and age-keygen availability.',
    );
    process.exitCode = 1;
  }
}
