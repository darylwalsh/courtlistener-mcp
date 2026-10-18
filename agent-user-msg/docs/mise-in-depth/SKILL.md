---
name: mise-in-depth
description: Use when working with mise only after first trying to use the mise skill found in @.claude/skills/mise
---

# Mise Skill

Use when working with mise

## When to Use This Skill

Use this skill when you need to:
- understand mise features, APIs, and workflows
- find concrete code examples before implementing or debugging
- navigate the official documentation quickly through categorized references

## Quick Reference

### High-Signal Examples

**Example 1** (bash):
```bash
export JAVA_HOME=$HOME/.local/share/installs/java/18
export PATH=$HOME/.local/share/installs/java/18/bin:$PATH
```

**Example 2** (json):
```json
[bootstrap.packages]
"apk:build-base" = "latest"
"apt:libssl-dev" = "latest"
"apt:build-essential" = "latest"
"brew:postgresql@17" = "latest"
"brew:ffmpeg" = "latest"
"brew-cask:firefox" = "latest"
"mas:497799835" = "latest"
```

**Example 3** (json):
```json
[bootstrap.user]
login_shell = "/bin/zsh"
```

**Example 4** (json):
```json
[settings]
system_packages.managers = ["apt"]
```

**Example 5** (json):
```json
[tools]
"s3:my-tool" = { version = "1.0.0", url = "s3://my-bucket/tools/my-tool-v1.0.0.tar.gz" }
```

### Key Usage Notes

**Pattern 1:** asdf (Legacy) Plugins ​WARNINGasdf plugins are considered legacy.

```
# Install from registry shorthand
mise use postgres@15

# This is equivalent to
mise use asdf:mise-plugins/mise-postgres@15
```

**Pattern 2:** bash# Install plugin directly from repository mise plugin install <plugin-name> <git-url> # Example: PostgreSQL plugin mise plugin install postgres...

```
# Install plugin directly from repository
mise plugin install <plugin-name> <git-url>

# Example: PostgreSQL plugin
mise plugin install postgres https://github.com/mise-plugins/mise-postgres
```

**Pattern 3:** mise dotfiles apply ​Usage: mise dotfiles apply [FLAGS] [TARGET]…Source code: src/cli/dotfiles/apply.rsApply dotfiles from [dotfiles]Applies config...

```
mise dotfiles apply
mise bootstrap dotfiles apply
mise dotfiles apply --dry-run
mise dotfiles apply --force --yes
```

**Pattern 4:** mise tasks validate ​Usage: mise tasks validate [--errors-only] [--json] [TASKS]…Source code: src/cli/tasks/validate.rsValidate tasks for common er...

```
# Validate all tasks
$ mise tasks validate

# Validate specific tasks
$ mise tasks validate build test

# Output results as JSON
$ mise tasks validate --json

# Only show errors (skip warnings)
$ mise tasks validate --errors-only
```

**Pattern 5:** mise bootstrap packages upgrade ​Usage: mise bootstrap packages upgrade [FLAGS] [PACKAGE]…Aliases: upSource code: src/cli/bootstrap/packages/upgrad...

```
mise bootstrap packages upgrade
mise bootstrap packages upgrade brew:postgresql@17
mise bootstrap packages upgrade --manager brew-cask
mise bootstrap packages upgrade --manager mas
mise bootstrap packages upgrade --manager apt --yes
mise bootstrap packages upgrade --dry-run
```

**Pattern 6:** mise dotfiles status ​Usage: mise dotfiles status [-J --json] [--missing] [TARGET]…Aliases: lsSource code: src/cli/dotfiles/status.rsShow the statu...

```
mise dotfiles status
mise bootstrap dotfiles status
mise dotfiles status ~/.zshrc
mise dotfiles status --json
mise dotfiles status --missing # exit 1 if anything is out of sync
```

**Pattern 7:** mise registry ​Usage: mise registry [FLAGS] [NAME]Source code: src/cli/registry.rsList available tools to installThis command lists the tools avail...

```
$ mise registry
node    core:node
poetry  asdf:mise-plugins/mise-poetry
ubi     cargo:ubi-cli

$ mise registry poetry
asdf:mise-plugins/mise-poetry
```

**Pattern 8:** mise version ​Usage: mise version [-J --json]Aliases: vSource code: src/cli/version.rsDisplay the version of miseDisplays the version, os, architec...

```
mise version
mise --version
mise -v
mise -V
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **backends.md** - Backends documentation
- **bootstrap.md** - Bootstrap documentation
- **cli.md** - Cli documentation
- **dev-tools.md** - Dev-Tools documentation
- **lang.md** - Lang documentation
- **other.md** - Other documentation
- **packages.md** - Packages documentation
- **tasks.md** - Tasks documentation

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### Start Here
Start with the getting_started or tutorials reference files for foundational concepts.

### For Specific Features
Use the appropriate category reference file (api, guides, etc.) for detailed information.

### For Code Examples
Use the high-signal examples above first, then open the matching reference file for full context.

## Notes

- This skill was automatically generated from official documentation
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference entries are filtered to avoid low-signal placeholders and inline tokens

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
