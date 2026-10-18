# ADR-0002: Git hook architecture — hk, driven by mise

## Status

Accepted.

## Context

The repo needs git hooks for security guardrails and quality gates (secret scanning, encrypted-secret
enforcement, linting, tests, commit-message linting). The common Node choice is husky, but husky adds
a `prepare` script and its own install dance, and hook steps then have to find their tools on PATH —
awkward in a shell that hasn't activated mise.

Since the project is already mise-centric, using mise's sister-project [`hk`](https://hk.jdx.dev)
(also by jdx) keeps the toolchain coherent and lets mise both install the hooks and resolve the tools
they run.

## Decision

Manage git hooks with **`hk`**, configured in **`hk.pkl`**, and drive it from mise:

- **Self-wiring:** `[hooks] postinstall = 'hk install --mise'` in `mise.toml` installs/refreshes the
  hooks on every `mise install`, so fresh clones wire themselves up. This replaces husky's `prepare`.
- **Tool resolution:** `HK_MISE = '1'` in `[env]` wraps hook step invocations in `mise x`, so tools
  (bun, eslint, gitleaks, …) resolve on PATH even in a non-mise-activated shell. Steps that call
  node-local tools use `bunx` (they live in `node_modules/.bin`).
- **pre-commit chain, in order** (security guardrails first — "re-activates what was dormant"):
  1. `gitleaks git --staged --redact`
  2. `mise run guard:sops` — blocks committing a plaintext (unencrypted) `.secrets.env.json`
     (see [ADR-0001](0001-eslint-over-biome-for-toml.md) for the linter, and the SOPS setup in
     `mise.toml`/`.sops.yaml`)
  3. `eslint` on staged files, with autofix (`fix = true`, `stash = "git"`)
  4. `mise run test`
- **commit-msg:** `commitlint --edit` (Conventional Commits). Commits are made via `mise run commit`
  (czg).
- **`hk fix` / `hk check`** run only the file linters (the shared `linters` mapping), with no guards
  or tests — for quick local fixes.

## Consequences

- One tool family (mise + hk) owns environment, tasks, and hooks; no husky, no separate `prepare`
  step, and hooks work regardless of shell activation state.
- Adding a pre-commit gate means editing `hk.pkl` (and, for tasks it shells out to, `mise.toml`) —
  not a scattered set of hook scripts.
- Hooks depend on `hk` being installed (it is pinned in `[tools]`); a clone that never runs
  `mise install` has no hooks until it does.
