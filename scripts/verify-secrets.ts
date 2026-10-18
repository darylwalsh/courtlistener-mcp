/**
 * @fileoverview Check fnox environment injection without printing secret values.
 * @module scripts/verify-secrets
 */
import { readFile } from 'node:fs/promises';
import { TOML } from 'bun';

const config = TOML.parse(await readFile(new URL('../fnox.toml', import.meta.url), 'utf8'));
const names = Object.keys(config.secrets ?? {});
const missing = names.filter((name) => !process.env[name]);
if (missing.length > 0) {
  process.stderr.write(`Missing injected secrets: ${missing.join(', ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Verified environment injection for ${names.length} project secrets.\n`);
}
