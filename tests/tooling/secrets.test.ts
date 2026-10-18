/**
 * @fileoverview Exercise the Bun secret-policy and initialization CLIs against
 * isolated files. age-keygen is replaced at the process boundary; no user keys
 * or gopass entries are read or changed.
 * @module tests/tooling/secrets.test
 */

import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const scripts = resolve('scripts');
const recipient = `age1${'q'.repeat(58)}`;
const privateFixture = 'private fixture identity';
const envelope = Buffer.concat([
  Buffer.from(
    `age-encryption.org/v1\n-> X25519 ${'A'.repeat(43)}\n${'A'.repeat(43)}\n--- ${'A'.repeat(43)}\n`,
  ),
  Buffer.alloc(32),
]).toString('base64');
const provider = `default_provider = "age"\n[providers.age]\ntype = "age"\nrecipients = ["${recipient}"]\n`;
let directory: string;
let repository: string;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'courtlistener-secret-test-'));
  repository = join(directory, 'repo');
  await mkdir(repository);
});

afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
});

function run(script: string, args: string[] = [], overrides: NodeJS.ProcessEnv = {}) {
  return new Promise<{ code: number; stderr: string; stdout: string }>((done) => {
    execFile(
      'bun',
      [join(scripts, script), ...args],
      {
        cwd: repository,
        env: {
          ...process.env,
          FNOX_AGE_KEY_FILE: '',
          FNOX_CONFIG_DIR: join(directory, 'config'),
          XDG_CONFIG_HOME: join(directory, 'xdg'),
          PATH: `${join(directory, 'bin')}:${process.env.PATH}`,
          ...overrides,
        },
      },
      (error, stdout, stderr) => {
        done({
          code: typeof error?.code === 'number' ? error.code : error ? 1 : 0,
          stdout,
          stderr,
        });
      },
    );
  });
}

async function check(text: string) {
  await writeFile(join(repository, 'fnox.toml'), text);
  return run('check-secrets.ts');
}

describe('committed fnox age policy', () => {
  it('accepts encrypted entries and inherits providers into nested profiles', async () => {
    const result = await check(`${provider}
[secrets]
API_KEY = { provider = "age", value = "${envelope}" }
[profiles.development.secrets]
API_KEY = { value = "${envelope}" }
[profiles.development.profiles.nested.secrets]
API_KEY = { provider = "age", value = "${envelope}" }
`);
    expect(result.code).toBe(0);
  });

  it('checks an explicit fixture path without reading local or global config', async () => {
    const config = join(directory, 'selected.toml');
    await writeFile(config, `${provider}\n[secrets]\nAPI_KEY = { value = "${envelope}" }`);
    await writeFile(join(repository, 'fnox.local.toml'), 'invalid local override');
    expect((await run('check-secrets.ts', [config])).code).toBe(0);
  });

  it.each([
    ['plaintext string', 'API_KEY = "private fixture identity"'],
    [
      'plaintext default',
      `API_KEY = { provider = "age", value = "${envelope}", default = "private fixture identity" }`,
    ],
    ['unknown provider', `API_KEY = { provider = "unknown", value = "${envelope}" }`],
    ['plaintext value', 'API_KEY = { provider = "age", value = "private fixture identity" }'],
    ['malformed base64', `API_KEY = { provider = "age", value = "${envelope}!" }`],
    [
      'truncated envelope',
      `API_KEY = { provider = "age", value = "${Buffer.from('age-encryption.org/v1\n').toString('base64')}" }`,
    ],
    [
      'unsupported batch',
      'API_KEY = { provider = "age", value = "fnox-age-batch-v1:private fixture identity" }',
    ],
    ['malformed TOML', 'API_KEY = "private fixture identity'],
  ])('rejects %s without printing supplied values', async (_label, secret) => {
    const result = await check(`${provider}\n[secrets]\n${secret}`);
    expect(result.code).toBe(1);
    expect(result.stdout + result.stderr).not.toContain(privateFixture);
    expect(result.stdout + result.stderr).not.toContain(envelope);
  });

  it.each([
    ['non-age provider', provider.replace('type = "age"', 'type = "env"')],
    [
      'undeclared default provider',
      provider.replace('default_provider = "age"', 'default_provider = "unknown"'),
    ],
    ['embedded private identity', `${provider}identity = "private fixture identity"`],
    ['imported config', `import = ["private fixture identity"]\n${provider}`],
    ['profile provider override', `${provider}\n[profiles.prod.providers.age]\ntype = "env"`],
    [
      'nested profile plaintext',
      `${provider}\n[profiles.prod.profiles.nested.secrets]\nAPI_KEY = "private fixture identity"`,
    ],
    ['malformed profiles', `profiles = ["private fixture identity"]\n${provider}`],
  ])('rejects %s', async (_label, config) => {
    const result = await check(config);
    expect(result.code).toBe(1);
    expect(result.stdout + result.stderr).not.toContain(privateFixture);
  });

  it('does not let a default provider turn a plaintext shorthand into ciphertext', async () => {
    expect((await check(`${provider}\n[secrets]\nAPI_KEY = "${envelope}"`)).code).toBe(1);
  });

  it('allows empty recipients only before secrets have been added', async () => {
    const empty = provider.replace(`["${recipient}"]`, '[]');
    expect((await check(empty)).code).toBe(0);
    expect((await check(`${empty}\n[secrets]\nAPI_KEY = { value = "${envelope}" }`)).code).toBe(1);
  });
});

async function prepareInit(config = provider) {
  await writeFile(join(repository, 'fnox.toml'), config);
  const binaryDir = join(directory, 'bin');
  await mkdir(binaryDir);
  await writeFile(
    join(binaryDir, 'age-keygen'),
    `#!/bin/sh
set -eu
if [ "\${TEST_AGE_KEYGEN_FAILURE:-}" = 1 ]; then
  printf '%s\\n' '${privateFixture}' >&2
  exit 1
fi
case "$1" in
  -y) test -f "$2"; printf '%s\\n' '${recipient}' ;;
  -o) test ! -e "$2"; printf '%s\\n' '${privateFixture}' > "$2" ;;
  *) exit 2 ;;
esac
`,
    { mode: 0o755 },
  );
}

describe('age identity initialization', () => {
  it('reuses an explicit identity and preserves configuration bytes across reruns', async () => {
    const config = `${provider}\n# Preserve this comment and ciphertext exactly.\n[secrets]\nAPI_KEY = { value = "${envelope}" }\n`;
    await prepareInit(config);
    const keyFile = join(directory, 'existing-age.txt');
    await writeFile(keyFile, privateFixture, { mode: 0o644 });
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = await run('secrets-init.ts', [], { FNOX_AGE_KEY_FILE: keyFile });
      expect(result.code).toBe(0);
      expect(result.stdout + result.stderr).not.toContain(privateFixture);
      expect(await readFile(join(repository, 'fnox.toml'), 'utf8')).toBe(config);
      expect(await readFile(keyFile, 'utf8')).toBe(privateFixture);
    }
    expect((await stat(keyFile)).mode & 0o777).toBe(0o600);
  });

  it.each([
    ['table', '[providers.age]\ntype = "age"\nrecipients = []\n'],
    ['inline table', '[providers]\nage = { type = "age", recipients = [] }\n'],
  ])(
    'creates a private external identity and fills an empty %s recipient list',
    async (_label, config) => {
      await prepareInit(`# Keep this comment.\n${config}`);
      expect((await run('secrets-init.ts')).code).toBe(0);
      const keyFile = join(directory, 'config', 'age.txt');
      expect((await stat(keyFile)).mode & 0o777).toBe(0o600);
      expect((await stat(dirname(keyFile))).mode & 0o777).toBe(0o700);
      const updated = await readFile(join(repository, 'fnox.toml'), 'utf8');
      expect(updated).toBe(`# Keep this comment.\n${config.replace('[]', `["${recipient}"]`)}`);
      expect((await run('secrets-init.ts')).code).toBe(0);
      expect(await readFile(join(repository, 'fnox.toml'), 'utf8')).toBe(updated);
    },
  );

  it('uses XDG_CONFIG_HOME when FNOX_CONFIG_DIR is unset', async () => {
    await prepareInit();
    const result = await run('secrets-init.ts', [], { FNOX_CONFIG_DIR: '' });
    expect(result.code).toBe(0);
    expect((await stat(join(directory, 'xdg', 'fnox', 'age.txt'))).mode & 0o777).toBe(0o600);
  });

  it('preserves established recipients and instructs re-encryption on a mismatch', async () => {
    const config = provider.replace(recipient, `age1${'p'.repeat(58)}`);
    await prepareInit(config);
    const result = await run('secrets-init.ts');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('fnox reencrypt --provider age');
    expect(result.stdout).toContain(recipient);
    expect(await readFile(join(repository, 'fnox.toml'), 'utf8')).toBe(config);
  });

  it.each(['direct', 'symlink'])(
    'refuses a %s identity location inside the repository',
    async (kind) => {
      await prepareInit();
      const alias = join(directory, 'repository-alias');
      if (kind === 'symlink') await symlink(repository, alias);
      const keyFile = join(kind === 'symlink' ? alias : repository, 'new', 'age.txt');
      const result = await run('secrets-init.ts', [], { FNOX_AGE_KEY_FILE: keyFile });
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('outside this repository');
      await expect(stat(join(repository, 'new'))).rejects.toMatchObject({ code: 'ENOENT' });
    },
  );

  it('does not initialize empty recipients around existing encrypted secrets', async () => {
    const config = `${provider.replace(`["${recipient}"]`, '[]')}\n[secrets]\nAPI_KEY = { value = "${envelope}" }`;
    await prepareInit(config);
    const result = await run('secrets-init.ts');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Restore the original recipients');
    expect(await readFile(join(repository, 'fnox.toml'), 'utf8')).toBe(config);
  });

  it('redacts subprocess errors', async () => {
    await prepareInit();
    const result = await run('secrets-init.ts', [], { TEST_AGE_KEYGEN_FAILURE: '1' });
    expect(result.code).toBe(1);
    expect(result.stdout + result.stderr).not.toContain(privateFixture);
    expect(result.stderr).toContain('Secret initialization failed');
  });

  it('redacts TOML parser errors', async () => {
    await prepareInit(`recipients = "${privateFixture}`);
    const result = await run('secrets-init.ts');
    expect(result.code).toBe(1);
    expect(result.stdout + result.stderr).not.toContain(privateFixture);
  });
});
