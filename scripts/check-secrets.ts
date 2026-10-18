#!/usr/bin/env bun
/**
 * @fileoverview Check committed fnox configuration for age ciphertext without
 * decrypting secrets or printing values. Deliberately excludes local/global files.
 * @module scripts/check-secrets
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { TOML } from 'bun';

type Table = Record<string, unknown>;

function table(value: unknown): value is Table {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Validate canonical base64 and age framing; authentication needs a private key. */
function ageEnvelope(value: unknown): boolean {
  if (typeof value !== 'string' || value.length === 0) return false;
  const decoded = Buffer.from(value, 'base64');
  if (decoded.toString('base64') !== value) return false;
  const header = decoded
    .toString('latin1')
    .match(
      /^age-encryption\.org\/v1\n(?:-> [!-~]+(?: [!-~]+)*\n(?:[A-Za-z0-9+/]{0,64}\n)*)+--- [A-Za-z0-9+/]{43}\n/,
    );
  // An age payload has a 16-byte nonce and at least one 16-byte authentication tag.
  return header !== null && decoded.length - header[0].length >= 32;
}

function checkConfig(config: unknown, inheritedProviders: Table = {}, inheritedDefault?: string) {
  if (!table(config)) throw new Error('Expected fnox configuration tables.');
  if ('import' in config || 'imports' in config || 'include' in config) {
    throw new Error(
      'Keep committed secrets in fnox.toml; imported configurations are not checked.',
    );
  }
  if ('ciphertext' in config) {
    throw new Error(
      'Batch ciphertext is unsupported; store each secret with fnox set --provider age.',
    );
  }

  const ownProviders = config.providers ?? {};
  if (!table(ownProviders)) throw new Error('Expected a providers table.');
  const providers = { ...inheritedProviders, ...ownProviders };
  for (const provider of Object.values(providers)) {
    if (!table(provider) || provider.type !== 'age') {
      throw new Error('Every committed provider must use type = "age".');
    }
    if (Object.keys(provider).some((key) => key !== 'type' && key !== 'recipients')) {
      throw new Error('Committed age providers may contain only type and public recipients.');
    }
    if (
      !Array.isArray(provider.recipients) ||
      provider.recipients.some(
        (recipient) => typeof recipient !== 'string' || !recipient.startsWith('age1'),
      )
    ) {
      throw new Error('Age providers require a public recipients array.');
    }
  }

  const defaultProvider = config.default_provider ?? inheritedDefault;
  if (
    defaultProvider !== undefined &&
    (typeof defaultProvider !== 'string' || !Object.hasOwn(providers, defaultProvider))
  ) {
    throw new Error('default_provider must name a declared age provider.');
  }

  const secrets = config.secrets ?? {};
  if (!table(secrets)) throw new Error('Expected a secrets table.');
  for (const secret of Object.values(secrets)) {
    if (!table(secret) || 'default' in secret) {
      throw new Error('Secrets must use age ciphertext without plaintext defaults.');
    }
    const provider = secret.provider ?? defaultProvider;
    if (typeof provider !== 'string' || !Object.hasOwn(providers, provider)) {
      throw new Error('Every secret must select a declared age provider.');
    }
    const selected = providers[provider];
    if (table(selected) && Array.isArray(selected.recipients) && selected.recipients.length === 0) {
      throw new Error('Age providers used by secrets must declare a public recipient.');
    }
    if (typeof secret.value === 'string' && secret.value.startsWith('fnox-age-batch-v1:')) {
      throw new Error(
        'Batch ciphertext is unsupported; store each secret with fnox set --provider age.',
      );
    }
    if (!ageEnvelope(secret.value)) {
      throw new Error('Secret values must be canonical base64 containing a complete age envelope.');
    }
  }

  const profiles = config.profiles ?? {};
  if (!table(profiles)) throw new Error('Expected a profiles table.');
  for (const profile of Object.values(profiles)) {
    checkConfig(
      profile,
      providers,
      typeof defaultProvider === 'string' ? defaultProvider : undefined,
    );
  }
}

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--help') {
  console.log('Usage: bun run scripts/check-secrets.ts [fnox.toml]');
} else if (args.length > 1 || args[0]?.startsWith('-')) {
  console.error('Usage: bun run scripts/check-secrets.ts [fnox.toml]');
  process.exitCode = 2;
} else {
  let config: unknown;
  try {
    config = TOML.parse(await readFile(resolve(args[0] ?? 'fnox.toml'), 'utf8'));
  } catch {
    // Parser and filesystem diagnostics can include supplied values or paths.
    console.error('Unable to read or parse fnox.toml.');
    process.exitCode = 1;
  }
  if (config !== undefined) {
    try {
      checkConfig(config);
      console.log('fnox.toml contains only declared age-encrypted secret entries.');
    } catch (error) {
      // checkConfig only throws fixed messages, never configuration values.
      console.error(error instanceof Error ? error.message : 'Invalid fnox configuration.');
      process.exitCode = 1;
    }
  }
}
