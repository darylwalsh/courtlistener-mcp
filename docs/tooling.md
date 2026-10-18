# Development tooling

`mise.toml` pins Bun, Node, fnox, age and Gitleaks and exposes the development
tasks. Bun continues to own JavaScript dependencies through `package.json` and
`bun.lock`. Biome, TypeScript and Vitest keep their existing configurations.
Existing project Python code and tooling remain valid; the Python reference
project is an example to adapt, not a dependency of this server.

## First setup

Install mise and activate it for your shell, then run from the checkout:

```sh
mise trust
mise install
mise run setup
mise run secrets:init
mise run secrets:verify
mise run build
mise run check
```

`setup` installs the locked dependencies. The existing Socket scanner runs during
installation and lock validation, so these tasks need registry access. With an
agent sandbox, allow the requested download/cache access when needed. An
installation failure is a failed check, not a reason to bypass the scanner.

`AGENTS.md` is the canonical agent guide. Upstream framework documentation still
lives at `node_modules/@cyanheads/mcp-ts-core/CLAUDE.md`; root `CLAUDE.md` is no
longer maintained. A development check enforces this choice.

## Daily tasks

Run `mise tasks` for descriptions. The usual loop is:

```sh
mise run fmt
mise run check
mise run build
mise run start:stdio
# or:
mise run start:http
```

`check` runs lockfile validation, read-only devcheck, Vitest, the fnox storage
policy, and Gitleaks over working files and every Git ref. Build is separate.
`lint`, `typecheck`, `test`, `lint:mcp`, `lint:packaging`, and `changelog:check`
are available individually. `test` invokes `bun run test`, which runs Vitest.
Arguments are forwarded, for example `mise run test -- tests/config/`.

Ordinary checks do not resolve fnox secrets. `secrets:verify`, startup, and
`courts:snapshot` explicitly decrypt credentials for their child process.
Startup and arbitrary-command tasks use mise's raw I/O mode so MCP stdin,
protocol output and interactive input reach the child unchanged.

Use ignored `mise.local.toml` for non-secret workstation overrides:

```toml
[env]
MCP_HTTP_PORT = "3011"
MCP_LOG_LEVEL = "debug"
```

No automatic dotenv loading or secret-decrypting directory hook is configured.
`.env.example` remains a variable reference, including deployment options.

## Encrypted credentials

The committed `fnox.toml` stores age ciphertext and public recipients. Its private
identity stays outside the repository. The default identity location is
`${XDG_CONFIG_HOME:-$HOME/.config}/fnox/age.txt`; `FNOX_CONFIG_DIR` and
`FNOX_AGE_KEY_FILE` can select another location. Back up the matching private key
securely. Generating a new key does not unlock existing ciphertext.

`secrets:init` reuses the matching identity, applies private file permissions,
and leaves established recipients unchanged. For a separate independent setup,
start with a new fnox configuration containing an empty `[secrets]` table and
`[providers.age]` with `type = "age"` and `recipients = []`, then run the task.
Keep the original encrypted file for rollback. For shared access, an existing
key holder must encrypt the entries to the additional recipient.

Add or rotate a credential using fnox's hidden prompt:

```sh
fnox set COURTLISTENER_API_TOKEN --provider age
mise run secrets:check
mise run secrets:verify
```

Do not pass credentials as command arguments. Keep `fnox.local.toml`, private
keys, and plaintext credentials out of Git. The storage check accepts individual
base64 age envelopes and rejects plaintext defaults, imported configs and
unsupported batch ciphertext. Use `fnox set --provider age` for this format;
`fnox reencrypt` may produce a batch format requiring a deliberate policy update.
The framing check does not prove decryption: `secrets:verify` performs actual
decryption and checks that each project secret reaches the child environment.

To launch another tool with these credentials:

```sh
mise run secrets:exec -- <command>
```

That task exposes every configured secret to the child process, so use it for
tools you intend to grant that access. Launch an MCP client this way when its
configured servers rely on inherited environment variables. The server itself
continues to read `COURTLISTENER_API_TOKEN` from its environment.

The storage and injection model follows [fnox's age provider documentation](https://fnox.jdx.dev/providers/age).
Task definitions follow [mise's TOML task documentation](https://mise.jdx.dev/tasks/toml-tasks.html).

## Migration record

On 2026-10-18, the 20 encrypted entries already present in the Python reference
project's `fnox.toml` were copied without changing their ciphertext or recipient.
They cover all names listed by `gopass ls -f migrated`. The CourtListener API
token was imported separately from `gopass courtlistener/api-key`; that entry
held a single token as a YAML body key after a blank password line. Its formatting
was removed before encryption. The imported value was compared with gopass in
memory, with no credential output or plaintext temporary files.

The project now owns its encrypted configuration and has no runtime dependency
on the reference project or gopass. Original gopass entries and reference files
are preserved for rollback. Only the CourtListener API credential was imported
from the `courtlistener/` folder; account login credentials are not required by
the server.

## Leak scanning and packaging

`mise run secrets:scan` scans working files and full Git history with redaction.
`mise run secrets:staged` checks staged changes before a commit. Installed
dependencies and generated output are excluded; source, fixtures, skills and
reference documents remain scanned. `.gitleaksignore` records two reviewed
documentation-example fingerprints. Review new findings individually.

Encrypted configuration, local overrides, private key filenames and reference
material are excluded from the Docker context and MCPB bundle. npm packaging
uses the existing explicit `package.json` file list, which excludes fnox files.

## Pocock's engineering workflow

Setup is configured for this fork's GitHub Issues, the five default triage labels,
and a single domain context. Read `docs/agents/issue-tracker.md`,
`docs/agents/triage-labels.md`, and `docs/agents/domain.md` when using those flows.
ADRs live in the existing `docs/decisions/` directory. A glossary can be added when
domain terminology is resolved; an empty glossary is not required for setup.

For a first engineering task, use the installed `ask-matt` skill to choose a
workflow, then the relevant planning/implementation skills. `to-tickets`,
`triage`, `to-spec`, and `wayfinder` consume the tracker configuration. Edit the
three configuration documents directly when conventions change; rerun setup
when switching trackers or restarting the configuration.

## Releases and validation limits

Validated on 2026-10-18: `mise run setup`, `mise run build`, `mise run check`,
and `mise run secrets:verify` passed. Vitest passed 756 tests across 37 files.
The stdio task completed MCP initialization and listed all 14 tools; the HTTP
task completed initialization on a temporary loopback port. Neither check called
the CourtListener API. Both smoke-test processes were stopped after verification.
Gitleaks passed working-file and 91-commit history scans and rejected a synthetic
credential with redacted output. All 20 reused ciphertext entries match their
reference source; all 21 configured entries decrypt and reach the child environment.

The existing gated release process is retained. Mise wrappers for release and
publishing do not authorize a release; use the documented three-run process in
`AGENTS.md`. The existing `publish-mcp` package script still uses macOS Keychain
authentication and needs a separate Linux publishing adaptation before use here.

The 2026-10-18 dependency audit reported upstream advisories in `braces` and
`sprintf-js`. `mise run audit:fix -- --dry-run` reported no published fixes.
Devcheck reports these transitive advisories as warnings. They are not suppressed.
The framework-skill mirror check also reports missing local copies; canonical
framework skills remain accessible under `framework-skills/` as documented in
`AGENTS.md`.
