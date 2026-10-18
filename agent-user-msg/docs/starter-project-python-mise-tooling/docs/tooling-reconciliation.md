# Legacy tooling reconciliation

The reference is an Arch workstation provisioning project with a prospective
TypeScript UI. This starter keeps its Python toolchain and carries over reusable
environment and secret-handling practices.

## Tool mapping

| Legacy | Starter decision |
|---|---|
| mise tool versions, environment, tasks | Retained; supports `mise-tasks/` and `tasks/*.toml` extensions |
| Node/Bun, ESLint, Prettier | Not required by the Python package; Ruff formats and lints Python |
| hk | prek owns hooks; do not install both hook managers |
| commitlint/czg, release tooling | Commitizen handles Conventional Commits, versions and changelogs |
| Gitleaks | Existing Betterleaks staged/history scans remain |
| SOPS + age JSON | fnox + age; encrypted values live in `fnox.toml` |
| Hardcoded home paths | XDG-aware configuration and ignored `mise.local.toml` |
| Arch packages, desktop, Podman, personal PATH | Workstation concerns; not installed by this template |
| MCP configuration | Optional client setup; launch the client with `secrets:exec` |

The reference omits its package manifest, lockfile and referenced task scripts,
so their dependency versions and task implementations cannot be reproduced.
The original tooling reconciliation copied no credentials or private keys.
The subsequent project-only secret import is recorded below.
The legacy reference checkout is no longer required for development or runtime.

## Secret inventory

Add only the variables needed by your application using
`fnox set NAME --provider age` (hidden prompt). No placeholder values are loaded.

| Purpose | Legacy environment names |
|---|---|
| Model providers | `GROQ_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENROUTER_API_KEY` |
| Hugging Face clients | `HF_TOKEN`, `HUGGINGFACE_API_KEY`, `HUGGINGFACEHUB_API_TOKEN` |
| Search and MCP | `REF_API_KEY`, `PERPLEXITY_API_KEY`, `BRAVE_API_KEY`, `FIRECRAWL_API_KEY`, `EXA_API_KEY` |
| GitHub default identity | `GITHUB_TOKEN`, `GITHUB_PAT` |
| Legacy alternate identities | `GITHUB_TOKEN_DM`, `GITHUB_PAT_DM`, `GITHUB_TOKEN_DW`, `GITHUB_PAT_DW`, `GITHUB_TOKEN_DW_kh4rmz3ro`, `GITHUB_PAT_DW_kh4rmz3ro` |

Names are preserved on import. The template does not choose a personal GitHub
identity automatically. Configure `GITHUB_TOKEN`/`GITHUB_PAT` for the identity you
intend to use. Hugging Face aliases are independent entries, not automatic copies.

## Import existing SOPS secrets into fnox

First run `mise run secrets:init`. With SOPS installed and access to the legacy
age identity, run the following in Bash from this repository. Replace the input
path with your encrypted legacy file; retain the original as a rollback source.

```bash
set -o pipefail
sops --decrypt --output-type json /path/to/legacy/.secrets.env.json |
  fnox import json --provider age --force
```

This explicit import writes encrypted values into `fnox.toml`; it may overwrite
matching names, so back up an existing encrypted configuration first. Plaintext
travels through the pipe, not a temporary file. Do not enable shell tracing or
redirect decrypted output to disk. SOPS is needed only for migration, not for
normal development. See the [fnox import reference](https://fnox.jdx.dev/cli/import.html).

## Environment and MCP use

```bash
mise run run -- python -m starter
mise run secrets:exec -- <editor-or-agent-command>
```

The second command supports non-Python clients and their child MCP servers.
Configure each client's environment-variable references using its own syntax;
the legacy `.mcp.json` is not a universal client configuration. Install Node only
if your chosen MCP servers require it, using a personal mise override. Avoid
logging environment dumps or embedding credentials in MCP URLs.

Normal linting and fast tests do not decrypt secrets. Keep non-secret machine
settings in ignored `mise.local.toml`; secrets remain in fnox. CI credentials
should be provided only to jobs that actually need them.

`mise run secrets:check` and the pre-commit hook reject plaintext fnox entries
and fallback defaults. The guard checks age envelope formatting without a key;
it does not prove decryption works. Other providers retain support for remote
references. Betterleaks supplies the complementary credential-pattern scan.

## Project secret import completed (2026-10-08)

All 20 names in the inventory above were imported from the local gopass
`migrated/` entries into this project's `fnox.toml` with the age provider.
Values traveled in memory to fnox; no plaintext intermediate files were created.
Every decrypted value matched its source, and all 20 environment variables were
verified through `mise run secrets:exec`. The original gopass entries remain
available for rollback. Back up the private age identity outside the repository;
it is needed to decrypt the committed ciphertext on another machine.

The project `.mcp.json` references injected environment variables. Ref uses an
`x-ref-api-key` header rather than a credential in its URL. All referenced names
were present in the injected environment; live MCP connections were not tested.

The full validation gate passed after reviewing 12 historical documentation
examples and recording their exact fingerprints in `.betterleaksignore`.
These exceptions do not exclude skills, files, rules, or whole commits.
