# Repository Guidelines

Instructions for coding agents (Claude Code, Codex, Cursor, etc.) working in this repo.

## Commands

Use mise tasks. Don't call tools directly unless a task doesn't exist for it.

| Task | What it does |
|---|---|
| `mise run fmt` | Auto-fix lint issues and format. Run after editing Python. |
| `mise run lint` | Ruff lint + format check (read-only) |
| `mise run typecheck` | Pyrefly, strict preset. This is the gate. |
| `mise run typecheck:ty` | ty, as a second opinion. Not blocking. |
| `mise run test` | Fast tests with coverage |
| `mise run test:all` | All tests, including integration, with secrets loaded |
| `mise run secrets:check` | Check fnox storage policy without decrypting secrets |
| `mise run secrets:scan` | Betterleaks scan of git history |
| `mise run check` | **Everything CI runs. Must pass before you say a task is done.** |
| `mise tasks` | List all tasks |

`check` includes lint, strict typing, fast tests, dependency audit, both secret checks,
and lockfile freshness. Report blocked checks explicitly; never present them as passing.

## Rules

- **Dependencies:** `uv add <pkg>` or `uv add --dev <pkg>`. Never `pip install`, never hand-edit
  versions in `pyproject.toml`, never edit `uv.lock`.
- **Run Python with `uv run`**, e.g. `uv run python -m starter`, so the project venv is used.
- **Never bypass hooks.** No `git commit --no-verify`. If a hook fails, fix the cause.
- **Commits use Conventional Commits:** `feat: ...`, `fix: ...`, `refactor: ...`, `test: ...`,
  `docs: ...`, `chore: ...`, `ci: ...`. Add `!` or a `BREAKING CHANGE:` footer for breaking changes.
  The commit-msg hook rejects anything else.
- **Data and models:** never commit datasets, checkpoints, or weights. `data/`, `models/` and
  `outputs/` are gitignored, and files over 1 MB are rejected by a hook.
- **Typing:** annotate all public functions. Don't silence pyrefly with `# type: ignore` or
  `# pyrefly: ignore` without a short comment saying why.
- **Tests:** add or update tests in `tests/` alongside behavior changes. Mark long-running tests
  `@pytest.mark.slow`, GPU tests `@pytest.mark.gpu`, and tests that call real APIs
  `@pytest.mark.integration`.

## Secrets and environment

- Run `mise run secrets:init` to prepare an age identity outside the repository.
  Add secrets with `fnox set NAME --provider age` using its hidden prompt.
- Commit age-encrypted values in `fnox.toml`, or configured remote-provider references.
  Never put credentials in code, dotenv files, notebooks, fixtures, or plaintext defaults.
- Read secrets from environment variables. Use `mise run run -- python -m starter`
  for Python; use `mise run secrets:exec -- <command>` for editors and MCP clients.
  Ordinary linting and fast tests must work without decrypting secrets.
- Keep non-secret machine overrides in ignored `mise.local.toml`. Respect
  `XDG_CONFIG_HOME`; avoid hardcoded home paths and personal GitHub identities.
- Do not print environment dumps, trace secret commands, or embed credentials in MCP URLs.
  The fnox guard checks age envelope formatting, not successful decryption;
  Betterleaks provides complementary scanning.
- Follow [tooling reconciliation](docs/tooling-reconciliation.md) for legacy variable
  names and SOPS import. Preserve the encrypted source for rollback and pipe decrypted
  JSON directly into fnox; never save plaintext intermediates.

## Tool ownership

Keep Python dependencies in `pyproject.toml`/`uv.lock`; mise manages external tools.
prek owns hooks, Ruff handles Python lint/format, and Commitizen handles commits/releases.
Do not install competing legacy hook managers or workstation provisioning tools.
Extend tasks through `mise-tasks/` or `tasks/*.toml` when needed.

## Agent sandbox and validation handoff

- `.codex/config.toml` defines the `mise-uv` permission profile; `.claude/settings.json`
  defines the corresponding Claude sandbox. `.devcontainer/` is optional.
- Codex legacy `sandbox_mode` settings override the project permission profile.
  Check the effective session permissions after restarting; successful downloads alone
  do not prove that the project's domain allowlist is active. See the
  [official permissions documentation](https://developers.openai.com/codex/permissions).
- Keep required download and verification hosts allowlisted, including
  `tuf-repo-cdn.sigstore.dev` for mise's Python artifact verification. prek also needs
  its cache writable. Git hook installation and commits may require approval for
  writes to protected `.git` paths. Report sandbox failures and use the approval flow.
- Ruff excludes `.agents`, `.claude`, `.codex`, and `.devcontainer`; both type checkers
  target `src` and `tests`. Keep these configuration directories version-controlled.
- Validation on 2026-10-08: uncached uv installation installed 38 packages;
  mise installed Python 3.13.16 only after an approved retry outside the sandbox.
  The missing Sigstore host and prek cache permission were then added to the configs;
  a fresh session must validate their enforcement. The devcontainer was not built.
- Session validation on 2026-10-08: full `mise run check` passed, including lint,
  strict typing, nine fast tests, dependency audit, fnox policy, lock freshness,
  and Betterleaks history scanning. This run used Python 3.13.15.
- The 12 initial-commit Betterleaks findings were reviewed as documentation-only
  examples. `.betterleaksignore` contains their exact commit/path/rule/line
  fingerprints; keep skills scanned and review new findings individually.
- Imported all 20 `migrated/` gopass entries into this project's `fnox.toml` using
  age encryption. Decrypted values matched the originals and environment injection
  passed. Source gopass entries remain available for rollback; the private age
  identity is outside the repository. Do not print values during verification.
- `.mcp.json` uses environment references, including Ref authentication in a header.
  Launch the client with `mise run secrets:exec -- <client-command>`. Environment
  references were checked; live MCP connectivity was not tested.
- The legacy reference project is no longer needed at runtime; retained decisions
  and the secret-name inventory are in `docs/tooling-reconciliation.md`.
- `cspell.json` is optional editor configuration; no cspell task or dependency was
  installed. Separate skill/editor changes remain pending outside this handoff.
- A read-only remote query succeeded outside the sandbox and advertised no branches
  or tags. Inside the sandbox, SSH still rejected the system proxy config's ownership
  or permissions. No push or history rewrite was performed.
- For a fresh-session smoke test, run `mise install`, `mise run setup`, and
  `mise run check`. Already-installed tools can make installation a no-op; use a
  temporary install destination or uncached environment when verifying downloads.

## Layout

```
src/starter/    package code (src layout; import as `starter`)
tests/          pytest tests
scripts/        project maintenance scripts
docs/           tooling decisions and migration instructions
mise.toml       tools, env and tasks
pyproject.toml  deps and all tool config (ruff, pyrefly, ty, pytest, commitizen)
fnox.toml       encrypted secrets
```
