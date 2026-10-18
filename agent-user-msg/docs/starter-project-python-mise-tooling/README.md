# starter

A Python starter kit for ML / AI / LLM projects built on **mise + uv**, with git hooks,
type checking, CVE and secret scanning, encrypted secrets, and an agent guide wired in.

## The stack (October 2026)

| Concern | Tool | Where it's configured |
|---|---|---|
| Tool versions, env, tasks | [mise](https://mise.jdx.dev) | `mise.toml` |
| Python, deps, lockfile, build | [uv](https://docs.astral.sh/uv/) | `pyproject.toml`, `uv.lock` |
| Lint + format (replaces Black, isort, flake8) | [Ruff](https://docs.astral.sh/ruff/) | `[tool.ruff]` |
| Type checking (gate) | [Pyrefly](https://pyrefly.org) 1.x, strict preset | `[tool.pyrefly]` |
| Type checking (second opinion) | [ty](https://docs.astral.sh/ty/) | `[tool.ty]` |
| Git hooks | [prek](https://prek.j178.dev) (Rust pre-commit) | `.pre-commit-config.yaml` |
| Commit messages, versioning, changelog | [Commitizen](https://commitizen-tools.github.io/commitizen/) | `[tool.commitizen]` |
| Dependency CVEs | `uv audit` (OSV) | `mise run audit` |
| Leaked-secret scanning | [Betterleaks](https://github.com/betterleaks/betterleaks) (Gitleaks successor) | hook + `mise run secrets:scan` |
| Encrypted secrets | [fnox](https://fnox.jdx.dev) + age | `fnox.toml` |
| Notebook hygiene | nbstripout | hook |
| Tests | pytest + pytest-cov | `[tool.pytest.ini_options]` |

Python tools come from `uv.lock`, so hooks, CI, you and your agents all run identical versions.
mise installs only what isn't on PyPI: Python, uv, fnox, age and betterleaks.

## Start a new project from this template

```bash
cp -r py-starter my-project && cd my-project   # or "Use this template" on GitHub
mise trust && mise install                     # tools; postinstall runs setup
mise run init my_package                       # rename package, git init, deps, hooks
mise run secrets:init                          # optional: your age key -> fnox.toml
mise run check                                 # everything should pass
git add -A && mise run commit                  # first Conventional Commit
```

For a fresh clone of a project that already exists, `mise install` is enough: the postinstall
hook runs `uv sync --locked --all-groups` and installs the git hooks (it is skipped when
`CI` is set). Routine mise tasks use `uv run --frozen`, keeping the committed lockfile
unchanged. Use `uv add` to change dependencies; `mise run lock:check` detects a stale lockfile.
The `init` task refreshes the lockfile after renaming, before running the locked setup.

`.python-version` and `mise.toml` both select Python 3.13; keep them aligned when changing
Python versions. VS Code uses the project interpreter and Ruff for formatting and import
cleanup on save; install the Ruff extension if you use VS Code outside the devcontainer.

> Git hooks call `uv` and `mise`, so they must be on your `PATH` where you commit. With
> `mise activate` in your shell profile, that's automatic. GUI git clients may need it too.

## Daily commands

```bash
mise run fmt          # fix + format
mise run check        # lint, typecheck, test, audit, secret scan, lock check (same as CI)
mise run test:all     # all tests incl. slow/gpu/integration, with secrets loaded
mise run run -- python -m my_package   # run anything with secrets in the env
uv add torch          # add a dependency
mise run commit       # guided Conventional Commit
mise run bump         # version bump + CHANGELOG + tag, from commit history
mise tasks            # list everything
```

## What runs when

| Stage | Checks |
|---|---|
| `pre-commit` | whitespace/EOF/line endings, YAML/TOML/JSON syntax, merge markers, private keys, files > 1 MB, Betterleaks on staged changes, nbstripout, Ruff fix + format, `uv.lock` freshness, Pyrefly |
| `commit-msg` | `cz check` (Conventional Commits) |
| `pre-push` | fast pytest suite |
| CI (`mise run ci`) | `uv sync --locked`, then everything in `mise run check`, plus `cz check` on PR commits |

Hooks are fast feedback; CI is the real gate. That matters with coding agents, which will
sometimes try `--no-verify`. `AGENTS.md` tells them not to, and CI catches it if they do anyway.

## Secrets with fnox

See [legacy tooling reconciliation](docs/tooling-reconciliation.md) for the tool
mapping, complete legacy secret-name inventory, SOPS import instructions, and
editor/MCP environment setup. Personal non-secret overrides belong in ignored
`mise.local.toml` or `.mise.local.toml`. Both `fnox.local.toml` and `.fnox.local.toml`
are ignored too.

```bash
mise run secrets:init                        # optional: create/reuse your age identity
fnox set OPENAI_API_KEY --provider age       # prompts for the value, encrypts into fnox.toml
fnox exec -- uv run --frozen python -m my_package  # or: mise run run -- python -m my_package
```

The key defaults to `${XDG_CONFIG_HOME:-$HOME/.config}/fnox/age.txt`;
`FNOX_AGE_KEY_FILE` overrides it. Initialization reuses existing identities and preserves
existing recipients and encrypted entries. If another recipient is already configured,
it prints enrollment instructions instead of changing the configuration.

The encrypted `fnox.toml` is committed. To share with a teammate or CI, add their age public key
(or SSH public key) to `recipients` and run `fnox reencrypt -p age`. For CI, store a dedicated
age private key as the `FNOX_AGE_KEY` secret and inject it only into a step that needs
decryption, such as `mise run test:all`. Ordinary GitHub Actions and Azure checks do not
receive a private key. For production, add a profile that points at 1Password,
Azure Key Vault, AWS or GCP instead of keeping values in git. See the comments in `fnox.toml`.

For optional non-secret environment settings, copy `.env.example` to `.env` and load it
explicitly with `uv run --env-file .env python -m my_package`. The file is not loaded
automatically. Keep credentials in fnox.

## Type checking: two checkers

Pyrefly reached 1.0 in May 2026 and has the highest typing-spec conformance of the Rust
checkers, so it gates CI. ty is still 0.0.x but is fast and catches some different bugs, so
`mise run typecheck:ty` is there as a second opinion. To make ty the gate instead, change the
`typecheck` task and the `pyrefly` hook in `.pre-commit-config.yaml`.

## ML / LLM notes

- `data/`, `models/`, `outputs/`, checkpoints and weight formats (`.safetensors`, `.pt`,
  `.gguf`, ...) are gitignored, and a hook blocks files over 1 MB. Use DVC, git-lfs, or object
  storage for artifacts.
- Notebooks are linted and formatted by Ruff and stripped of outputs on commit.
- pytest markers `slow`, `gpu` and `integration` are excluded from the default `test` task and
  the pre-push hook. `test:all` runs them with secrets loaded.
- For PyTorch with CUDA, configure a uv index per platform. See uv's
  [PyTorch guide](https://docs.astral.sh/uv/guides/integration/pytorch/).

## CI

`.github/workflows/ci.yml` and `azure-pipelines.yml` both just install mise and run
`mise run ci`, so CI and local runs can't drift. Delete the one you don't use.
