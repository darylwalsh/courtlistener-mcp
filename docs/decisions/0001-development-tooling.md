# ADR 0001: Repository development tools and agent conventions

Date: 2026-10-18
Status: Accepted

## Context

This fork needs a consistent development entry point, encrypted credentials,
and configuration for Matt Pocock's engineering skills. The Python reference
project demonstrates the desired mise/fnox workflow. The MCP server already
uses Bun, Biome, TypeScript and Vitest.

## Decision

- `AGENTS.md` is the canonical repository agent guide. Remove the duplicate root
  `CLAUDE.md`; preserve framework documentation at its original dependency path.
- Mise pins external tools and orchestrates tasks. Existing Bun scripts and
  `bun.lock` retain dependency and execution ownership. Keep existing project
  Python code/tooling; implement adaptations of the Python example in TypeScript.
- Fnox stores individual age-encrypted secrets and injects them explicitly into
  credential-bearing processes. Reuse the existing external age identity. Ordinary
  checks run without decryption.
- Gitleaks scans working files and Git history, with only reviewed narrow
  exceptions. A separate check rejects plaintext fnox entries without a key.
- Pocock skills use `darylwalsh/courtlistener-mcp` GitHub Issues and default triage
  labels. Domain documentation is single-context, with ADRs in `docs/decisions/`.
- Preserve the gated release process and the local verification model.

## Consequences

Contributors use `mise run <task>` and can still inspect the underlying Bun
scripts. A matching private identity is needed for encrypted credentials;
generating a new identity cannot decrypt the existing configuration. Secret
injection is explicit, and the checked-in ciphertext is excluded from runtime
distribution artifacts. Upstream framework syncs must preserve these fork choices.

See [development tooling](../tooling.md) for commands, migration provenance and
validation limitations.
