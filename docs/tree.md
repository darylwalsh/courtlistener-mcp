# main - Directory Structure

Generated on: 2026-10-18 13:06:04

```text
main/
├── .claude-plugin/
│   └── plugin.json
├── .codex-plugin/
│   ├── mcp.json
│   └── plugin.json
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── config.yml
│   │   └── feature_request.yml
│   ├── workflows/
│   │   └── codeql.yml
│   ├── CODE_OF_CONDUCT.md
│   ├── CONTRIBUTING.md
│   ├── FUNDING.yml
│   └── SECURITY.md
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── changelog/
│   ├── 0.1.x/
│   ├── 0.2.x/
│   ├── 0.3.x/
│   ├── 0.4.x/
│   ├── 0.5.x/
│   ├── 0.6.x/
│   ├── 0.7.x/
│   ├── 0.8.x/
│   └── template.md
├── docs/
│   ├── agents/
│   │   ├── domain.md
│   │   ├── handoff.md
│   │   ├── issue-tracker.md
│   │   ├── setup-checklist.md
│   │   └── triage-labels.md
│   ├── decisions/
│   │   ├── 0000-use-adrs.md
│   │   ├── 0001-development-tooling.md
│   │   └── EXAMPLE-ADR-0002-hook-architecture.md
│   ├── design.md
│   ├── idea.md
│   └── tooling.md
├── framework-skills/
│   ├── add-app-tool/
│   │   └── SKILL.md
│   ├── add-prompt/
│   │   └── SKILL.md
│   ├── add-resource/
│   │   └── SKILL.md
│   ├── add-service/
│   │   └── SKILL.md
│   ├── add-test/
│   │   └── SKILL.md
│   ├── add-tool/
│   │   └── SKILL.md
│   ├── api-auth/
│   │   └── SKILL.md
│   ├── api-canvas/
│   │   └── SKILL.md
│   ├── api-config/
│   │   └── SKILL.md
│   ├── api-context/
│   │   └── SKILL.md
│   ├── api-errors/
│   │   └── SKILL.md
│   ├── api-linter/
│   │   └── SKILL.md
│   ├── api-mirror/
│   │   └── SKILL.md
│   ├── api-services/
│   │   ├── references/
│   │   │   ├── graph.md
│   │   │   ├── llm.md
│   │   │   └── speech.md
│   │   └── SKILL.md
│   ├── api-telemetry/
│   │   └── SKILL.md
│   ├── api-testing/
│   │   └── SKILL.md
│   ├── api-utils/
│   │   ├── references/
│   │   │   ├── formatting.md
│   │   │   ├── parsing.md
│   │   │   └── security.md
│   │   └── SKILL.md
│   ├── api-workers/
│   │   └── SKILL.md
│   ├── code-simplifier/
│   │   └── SKILL.md
│   ├── design-mcp-server/
│   │   └── SKILL.md
│   ├── field-test/
│   │   └── SKILL.md
│   ├── git-wrapup/
│   │   └── SKILL.md
│   ├── maintenance/
│   │   └── SKILL.md
│   ├── orchestrations/
│   │   ├── workflows/
│   │   │   ├── field-test-fix.md
│   │   │   ├── fix-wrapup-release.md
│   │   │   ├── greenfield-build.md
│   │   │   └── maintenance-release.md
│   │   └── SKILL.md
│   ├── polish-docs-meta/
│   │   ├── references/
│   │   │   ├── agent-protocol.md
│   │   │   ├── package-meta.md
│   │   │   ├── readme.md
│   │   │   └── server-json.md
│   │   └── SKILL.md
│   ├── release-and-publish/
│   │   └── SKILL.md
│   ├── release-pr-review/
│   │   └── SKILL.md
│   ├── report-issue-framework/
│   │   └── SKILL.md
│   ├── report-issue-local/
│   │   └── SKILL.md
│   ├── security-pass/
│   │   └── SKILL.md
│   ├── setup/
│   │   └── SKILL.md
│   ├── techniques/
│   │   ├── references/
│   │   │   └── outline-on-overflow.md
│   │   └── SKILL.md
│   └── tool-defs-analysis/
│       └── SKILL.md
├── scripts/
│   ├── build-changelog.ts
│   ├── build.ts
│   ├── check-dependency-specifiers.ts
│   ├── check-docs-sync.ts
│   ├── check-framework-antipatterns.ts
│   ├── check-secrets.ts
│   ├── check-skill-versions.ts
│   ├── check-skills-sync.ts
│   ├── clean-mcpb.ts
│   ├── clean.ts
│   ├── devcheck.ts
│   ├── generate-court-names.ts
│   ├── install-otel.ts
│   ├── lint-mcp.ts
│   ├── lint-packaging.ts
│   ├── list-skills.ts
│   ├── prune-musl-packages.ts
│   ├── release-github.ts
│   ├── secrets-init.ts
│   ├── tree.ts
│   └── verify-secrets.ts
├── src/
│   ├── config/
│   │   └── server-config.ts
│   ├── mcp-server/
│   │   ├── prompts/
│   │   │   └── definitions/
│   │   │       └── legal-research.prompt.ts
│   │   ├── resources/
│   │   │   └── definitions/
│   │   │       └── courts-reference.resource.ts
│   │   └── tools/
│   │       └── definitions/
│   │           ├── get-citations.tool.ts
│   │           ├── get-docket.tool.ts
│   │           ├── get-financial-disclosure.tool.ts
│   │           ├── get-judge.tool.ts
│   │           ├── get-opinion.tool.ts
│   │           ├── get-oral-argument.tool.ts
│   │           ├── get-parties.tool.ts
│   │           ├── lookup-citation.tool.ts
│   │           ├── lookup-courts.tool.ts
│   │           ├── search-dockets.tool.ts
│   │           ├── search-financial-disclosures.tool.ts
│   │           ├── search-judges.tool.ts
│   │           ├── search-opinions.tool.ts
│   │           └── search-oral-arguments.tool.ts
│   ├── services/
│   │   └── courtlistener/
│   │       ├── citing-offset.ts
│   │       ├── codes.ts
│   │       ├── court-names-data.ts
│   │       ├── court-names.ts
│   │       ├── courtlistener-service.ts
│   │       ├── dates.ts
│   │       ├── jurisdictions.ts
│   │       ├── page-metadata.ts
│   │       ├── readable-text.ts
│   │       ├── retrieval.ts
│   │       ├── types.ts
│   │       └── uri.ts
│   └── index.ts
├── tests/
│   ├── config/
│   │   └── server-config.test.ts
│   ├── helpers/
│   │   └── capture-error.ts
│   ├── prompts/
│   │   └── legal-research.prompt.test.ts
│   ├── resources/
│   │   └── courts-reference.resource.test.ts
│   ├── service/
│   │   ├── citing-offset.test.ts
│   │   ├── codes.test.ts
│   │   ├── court-names.test.ts
│   │   ├── courtlistener-service.pacing.test.ts
│   │   ├── courtlistener-service.retry.test.ts
│   │   ├── courtlistener-service.test.ts
│   │   ├── dates.test.ts
│   │   ├── jurisdictions.test.ts
│   │   ├── readable-text.test.ts
│   │   ├── retrieval.test.ts
│   │   └── uri.test.ts
│   ├── tooling/
│   │   └── secrets.test.ts
│   ├── tools/
│   │   ├── attorney-budget.test.ts
│   │   ├── bounded-pages.test.ts
│   │   ├── code-normalization-contracts.test.ts
│   │   ├── error-recovery-contracts.test.ts
│   │   ├── get-citations.tool.test.ts
│   │   ├── get-docket.tool.test.ts
│   │   ├── get-financial-disclosure.tool.test.ts
│   │   ├── get-judge.tool.test.ts
│   │   ├── get-opinion.tool.test.ts
│   │   ├── get-oral-argument.tool.test.ts
│   │   ├── get-parties.tool.test.ts
│   │   ├── inherited-label-contracts.test.ts
│   │   ├── lookup-citation.tool.test.ts
│   │   ├── lookup-courts.tool.test.ts
│   │   ├── readable-retrieval.test.ts
│   │   ├── search-dockets.tool.test.ts
│   │   ├── search-financial-disclosures.tool.test.ts
│   │   ├── search-judges.tool.test.ts
│   │   ├── search-opinions.tool.test.ts
│   │   ├── search-oral-arguments.tool.test.ts
│   │   └── search-query-contracts.test.ts
│   └── security.test.ts
├── .dockerignore
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── .gitleaks.toml
├── .gitleaksignore
├── .mcpbignore
├── AGENTS.md
├── biome.json
├── bun.lock
├── bunfig.toml
├── CHANGELOG.md
├── CITATION.cff
├── devcheck.config.json
├── Dockerfile
├── fnox.toml
├── LICENSE
├── manifest.json
├── mise.toml
├── package.json
├── README.md
├── server.json
├── skills-lock.json
├── tsconfig.build.json
├── tsconfig.json
└── vitest.config.ts
```

_Note: This tree excludes files and directories matched by .gitignore and default patterns._
