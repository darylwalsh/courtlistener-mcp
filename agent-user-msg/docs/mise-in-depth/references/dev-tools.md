# Mise - Dev-Tools

**Pages:** 29

---

## S3 Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/s3.html

**Contents:**
- S3 Backend ​
- Usage ​
- Authentication ​
- Tool Options ​
  - url (Required) ​
  - endpoint ​
  - region ​
  - Platform-specific URLs ​
  - checksum ​
  - size ​

You may install tools directly from Amazon S3 or S3-compatible storage (like MinIO) using the s3 backend. This backend is ideal for enterprise teams hosting proprietary tools in private S3 buckets.

The code for this is inside of the mise repository at ./src/backend/s3.rs.

The following installs a tool from an S3 bucket:

The version will be set in ~/.config/mise/config.toml with the following format:

The S3 backend uses the AWS SDK default credential chain. Credentials are loaded from (in order):

The following tool-options are available for the s3 backend—these go in [tools] in mise.toml.

Specifies the S3 URL to download the tool from. The URL supports templating with {{ version }}:

Specify a custom S3-compatible endpoint for services like MinIO, DigitalOcean Spaces, or self-hosted S3:

Specify the AWS region for the S3 bucket:

For tools that need different downloads per platform, use the table format:

Verify the downloaded file with a checksum:

Instead of specifying the checksum here, you can use mise.lock to manage checksums.

Verify the downloaded object size:

You can specify different sizes for different platforms:

Number of directory components to strip when extracting archives:

If strip_components is not explicitly set, mise will automatically detect when to apply strip_components = 1. This happens when the extracted archive contains exactly one directory at the root level and no files.

Rename the downloaded binary to a specific name. This is useful when downloading a single binary object that has a platform-specific name:

When downloading single binaries (not archives), mise automatically removes OS/arch suffixes from the filename. For example, my-tool-linux-x86_64 becomes my-tool automatically. Use the bin option only when you need a specific custom name.

Rename the executable after extraction from an archive. This is useful when the archive contains a binary with a platform-specific name that you want to rename:

Use rename_exe for archives where the binary inside has a different name than desired. Use bin for single binary downloads (not archives).

Specify the directory containing binaries within the extracted archive:

Explicitly specify the archive format when the URL lacks a file extension:

The S3 backend supports two methods for discovering available versions.

Fetch available versions from a JSON manifest file stored in S3:

The manifest file can be a JSON array of version strings:

Or a JSON array of objects (use version_json_path to extract versions):

Extract versions from JSON responses using a jq-like path expression:

Extract versions using an expr-lang expression for complex version extraction logic:

The expression receives the response body as the body variable and should return an array of version strings.

Discover versions by listing objects in the S3 bucket:

Here's a complete example using MinIO as an S3-compatible backend:

With environment variables:

**Examples:**

Example 1 (sass):
```sass
mise use -g "s3:my-tool[url=s3://my-bucket/tools/my-tool-v1.0.0.tar.gz]@1.0.0"
```

Example 2 (json):
```json
[tools]
"s3:my-tool" = { version = "1.0.0", url = "s3://my-bucket/tools/my-tool-v1.0.0.tar.gz" }
```

Example 3 (markdown):
```markdown
# Set credentials via environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"

mise install
```

Example 4 (json):
```json
[tools]
"s3:my-tool" = { version = "1.0.0", url = "s3://my-bucket/tools/my-tool-v{{ version }}.tar.gz" }
```

---

## Go Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/go.html

**Contents:**
- Go Backend ​
- Dependencies ​
- Usage ​
- Tool Options ​
  - install_env ​
  - tags ​

You may install packages directly via go install even if there isn't an asdf plugin for it.

The code for this is inside of the mise repository at ./src/backend/go.rs.

This relies on having go installed. Which you can install via mise:

Any method of installing go is fine if you want to install go some other way. mise will use whatever go is on PATH.

The following installs the latest version of hivemind and sets it as the active version on PATH:

The following tool-options are available for the go backend—these go in [tools] in mise.toml.

Set environment variables for the go install command. mise still sets GOBIN to the tool install directory after applying install_env.

Specify go build tags (passed as go install -tags):

**Examples:**

Example 1 (unknown):
```unknown
mise use -g go
```

Example 2 (unknown):
```unknown
$ mise use -g go:github.com/DarthSim/hivemind
$ hivemind --help
Hivemind version 1.1.0
```

Example 3 (json):
```json
[tools]
"go:github.com/DarthSim/hivemind" = { version = "latest", install_env = { GOPRIVATE = "github.com/acme/*" } }
```

Example 4 (json):
```json
[tools]
"go:github.com/golang-migrate/migrate/v4/cmd/migrate" = { version = "latest", tags = "postgres" }
```

---

## Conda Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/conda.html

**Contents:**
- Conda Backend ​
- Dependencies ​
- Usage ​
  - Specifying a Version ​
  - Using a Different Channel ​
- Platform Support ​
- Settings ​
  - conda.channel
- Tool Options ​
  - channel ​

You may install packages directly from conda-forge and other Anaconda channels without needing conda or mamba installed.

This backend fetches pre-built packages from the anaconda.org API and extracts them directly, making it a lightweight way to install conda packages as standalone CLI tools.

The code for this is inside the mise repository at ./src/backend/conda.rs.

None. Unlike other conda tools, this backend does not require conda, mamba, or micromamba to be installed. It downloads and extracts packages directly from anaconda.org.

The following installs the latest version of ruff and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

By default, packages are installed from conda-forge. You can specify a different channel:

The conda backend automatically selects the appropriate package for your platform:

If a platform-specific package is not available, the backend will fall back to noarch packages.

Set these with mise settings set [VARIABLE]=[VALUE] or by setting the environment variable listed.

Default conda channel when installing packages with the conda backend. Override per-package with conda:package[channel=bioconda].

The most common channels are:

The following tool-options are available for the conda backend—these go in [tools] in mise.toml.

Override the conda channel for a specific package:

**Examples:**

Example 1 (unknown):
```unknown
$ mise use -g conda:ruff
$ ruff --version
ruff 0.8.0
```

Example 2 (json):
```json
[tools]
"conda:ruff" = "latest"
```

Example 3 (elixir):
```elixir
mise use -g conda:ruff@0.7.0
```

Example 4 (sass):
```sass
mise use -g "conda:ruff[channel=bioconda]"
```

---

## Tool Stubs | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/tool-stubs.html

**Contents:**
- Tool Stubs ​
- Overview ​
- Tool (non-http) Stubs ​
- Configuration Fields ​
  - Optional Fields ​
- HTTP Stubs ​
  - Platform-Specific Binary Paths ​
- Generating Tool Stubs (http) ​
  - Basic Generation ​
  - Platform-Specific Generation ​

Tool stubs allow you to create executable files with embedded TOML configuration for tool execution. They provide a convenient way to define tool versions, backends, and execution parameters directly within executable scripts. They are also a good way to have some tools in mise lazy-load since the tools are only fetched when called and not when calling something like mise install.

This feature is inspired by dotslash, which pioneered the concept of executable files with embedded configuration for portable tool execution.

A tool stub is an executable file that begins with a shebang line pointing to mise tool-stub and contains TOML configuration specifying which tool to execute and how to execute it. When the stub is run, mise automatically installs the specified tool version (if needed) and executes it with the provided arguments.

Tool stubs can use any mise backend but because they default to http—and http backend tools have things like urls and don't require a version—the http stubs look a bit different than non-http stubs.

Tool stubs are particularly useful for adding less-commonly used tools to your mise setup. Since tools are only installed when their stub is first executed, you can define many tools without the overhead of installing them all upfront. This is perfect for specialized tools, testing utilities, or project-specific binaries that you might not use every day.

The -S flag tells env to split the command line on spaces, allowing multiple arguments to be passed to the interpreter. This is necessary because shebangs on Unix systems traditionally only support a single argument after the interpreter path. Using env -S mise tool-stub allows the shebang to work correctly by splitting it into env → mise → tool-stub.

Tool stub configuration is essentially a subset of what can be done in mise.toml [tools] sections, with the addition of a tool field to specify which tool to use. All the same options available for tool configuration in mise.toml are supported in tool stubs.

For multi-platform tarballs:

For platform-specific tarballs:

Different platforms may have different binary structures or names. You can specify platform-specific bin fields when the binary path differs between platforms:

The tool stub generator automatically detects when platforms have different binary paths and will generate platform-specific bin fields when needed, or use a global bin field when all platforms have the same binary structure.

tool stubs default to the HTTP backend if no tool field is specified and a url field is present. See the HTTP backend documentation for full details on configuring HTTP-based tools.

While you can manually create tool stubs with TOML configuration, mise provides a mise generate tool-stub command to automatically create stubs for HTTP-based tools.

When using platform-specific URLs, the tool stub generator will append new platforms to existing stub files rather than overwriting them. This allows you to incrementally build cross-platform tool stubs by running the command multiple times with different platforms.

Generate a tool stub for a tool distributed via HTTP:

For tools with different URLs per platform, you can generate all platforms at once:

Auto-Platform Detection: If the URL contains platform information, you can omit the platform prefix and let mise auto-detect it:

Or build them incrementally by adding platforms one at a time:

The generator will preserve existing configuration and merge new platforms into the [platforms] table. If you specify a platform that already exists, its URL will be updated.

The generator automatically detects and extracts various archive formats:

Running the generation command produces an executable stub like:

The generator automatically:

The [lock] section is generated by mise generate tool-stub --lock and provides reproducible downloads with checksum verification. The tool/version fields are still used for backend resolution, while lock data provides the download shortcuts.

Locking is especially useful for avoiding GitHub API rate limits when users don't have a GITHUB_TOKEN set. With locked stubs, tools can be installed without any API calls at runtime.

This resolves the version, fetches URLs for all common platforms (linux-x64, linux-arm64, macos-x64, macos-arm64, windows-x64), and writes them into a [lock] section in the stub.

To bump the version of a locked stub, pass --version along with --lock:

Make the stub executable and run it directly:

Execute using the mise tool-stub command—useful for testing if something isn't working right:

Tool stubs implement intelligent caching which reduces the overhead mise has when running stubs:

Cached stubs have ~4ms of overhead.

For basic use cases, you can quickly create simple tool stubs using the mise x command as an alternative to writing TOML configuration manually:

This approach is ideal for simple tool execution without the need for custom options, environment variables, or platform-specific settings. For more complex configurations, use the full TOML configuration format described above.

**Examples:**

Example 1 (markdown):
```markdown
#!/usr/bin/env -S mise tool-stub
# Optional comment describing the tool

version = "1.0.0"
tool = "python"
bin = "python"
```

Example 2 (unknown):
```unknown
#!/usr/bin/env -S mise tool-stub
url = "https://example.com/releases/1.0.0/tool-linux-x64.tar.gz"
```

Example 3 (json):
```json
#!/usr/bin/env -S mise tool-stub
[platforms.linux-x64]
url = "https://example.com/releases/1.0.0/tool-linux-x64.tar.gz"

[platforms.darwin-arm64]
url = "https://example.com/releases/1.0.0/tool-macos-arm64.tar.gz"
```

Example 4 (json):
```json
#!/usr/bin/env -S mise tool-stub
# Global bin field used when platforms have the same structure
bin = "bin/tool"

[platforms.linux-x64]
url = "https://example.com/tool-linux.tar.gz"
# Uses global bin field: "bin/tool"

[platforms.windows-x64]
url = "https://example.com/tool-windows.zip"
bin = "tool.exe"  # Platform-specific binary for Windows
```

---

## Forgejo Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/forgejo.html

**Contents:**
- Forgejo Backend ​
- Usage ​
- Authentication ​
  - Token priority ​
  - Environment variables ​
  - Token file (forgejo_tokens.toml) ​
  - credential_command ​
  - fj CLI integration ​
  - git credential fill fallback ​
  - Debugging token resolution ​

You may install Codeberg and other Forgejo compatible release assets directly using the forgejo backend. This backend downloads release assets from Forgejo repositories and is ideal for tools that distribute pre-built binaries through Forgejo releases.

By default, the Forgejo backend uses the public Codeberg instance at https://codeberg.org. For other or self-hosted Forgejo instances, you can specify a custom API URL using the api_url tool option.

The code for this is inside of the mise repository at src/backend/github.rs.

The following installs the latest version of a tool from Forgejo releases and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

For private repositories or higher API limits, mise supports several Forgejo token sources.

mise checks these sources in order and uses the first token found:

For self-hosted Forgejo instances:

You can provide a shell command that prints a token to stdout:

mise executes this command with the configured default inline shell. The target hostname is available as MISE_CREDENTIAL_HOST, and the provider name (forgejo) is available as MISE_CREDENTIAL_PROVIDER. For compatibility, recognized sh-compatible shells (ash, bash, dash, ksh, sh, and zsh) also receive the hostname as $1/${1}.

The legacy $1/${1} hostname argument is deprecated. Use MISE_CREDENTIAL_HOST instead. mise will start warning in 2026.11.0, and $1 compatibility will be removed in 2027.11.0.

mise can read tokens from the fj CLI (keys.json) as a fallback. It checks:

Disable this fallback with:

As a last resort, mise can query git credential helpers:

This uses git credential fill and supports credentials stored by helpers such as macOS Keychain.

Use mise token forgejo to see which token mise would use for a given host:

The following tool-options are available for the forgejo backend—these go in [tools] in mise.toml.

When no asset_pattern is specified, mise automatically selects the best asset for your platform. The system scores assets based on:

For most tools, you can simply install without specifying patterns:

The autodetection logic is implemented in src/backend/asset_matcher.rs, which is shared by the GitHub, GitLab, and Forgejo backends.

Specifies the pattern to match against release asset names. This is useful when there are multiple assets for your OS/arch combination or when you need to override autodetection.

Narrows asset selection to names containing the given substring, while keeping platform autodetection. Unlike asset_pattern (which replaces autodetection entirely), matching only refines the candidate set — autodetection still chooses the correct OS/arch from the narrowed list, so a single config stays portable across platforms.

This is the option to reach for when a repository ships multiple binaries as separate per-platform assets and autodetection can't tell which one you want.

Tool options can also be passed inline on the command line using [key=value] syntax:

matching is a case-sensitive substring test, so a value that is also a substring of another asset's name (e.g. matching = "tool" when both tool-* and tool-extras-* are published) won't uniquely select your binary. Use matching_regex with an anchor when you need a precise match.

If asset_pattern is also set, it takes precedence and matching/matching_regex are ignored — asset_pattern replaces autodetection entirely, so there is no candidate set left for them to narrow. They are ignored silently: when asset_pattern is set, a matching_regex is never consulted and an invalid one is not reported, since mise does not error on a superseded option.

Like matching, but the asset name must match the given regular expression. Use this when a substring isn't selective enough. The match is case-sensitive; use an inline (?i) flag for case-insensitive matching.

If both matching and matching_regex are set, an asset must satisfy both (logical AND) to remain a candidate.

matching/matching_regex are not part of the install path — it is keyed by the tool name (user/repo, or a tool_alias) and version. To install two binaries from the same release, give each its own tool_alias so they get distinct install directories; reusing the same forgejo:user/repo string with different matching values resolves to the same directory and the second install overwrites the first.

Specifies a custom version prefix for release tags. By default, mise handles the common v prefix (e.g., v1.0.0), but some repositories use different prefixes like release-, version-, or no prefix at all.

When version_prefix is configured, mise will:

By default, releases flagged prerelease: true on Forgejo are excluded from mise ls-remote and from latest resolution. Set prerelease = true to include them:

Draft releases are always excluded.

For different asset patterns per platform:

Verify the downloaded file with a checksum:

Instead of specifying the checksum here, you can use mise.lock to manage checksums.

Verify the downloaded asset size:

Number of directory components to strip when extracting archives:

If strip_components is not explicitly set, mise will automatically detect when to apply strip_components = 1. This happens when the extracted archive contains exactly one directory at the root level and no files. This is common with tools like ripgrep that package their binaries in a versioned directory (e.g., mytool-14.1.0-x86_64-unknown-linux-musl/mytool). The auto-detection ensures the binary is placed directly in the install path where mise expects it.

Rename the downloaded binary to a specific name. This is useful when downloading single binaries that have platform-specific names:

When downloading single binaries (not archives), mise automatically removes OS/arch suffixes from the filename. For example, docker-compose-linux-x86_64 becomes docker-compose automatically. Use the bin option only when you need a specific custom name.

Rename the executable after extraction from an archive. This is useful when the archive contains a binary with a platform-specific name that you want to rename:

Use rename_exe for archives where the binary inside has a different name than desired. Use bin for single binary downloads (non-archives).

Skip macOS .app bundle assets during autodetection and prefer standalone CLI binaries instead. This is useful when a repository provides both a macOS .app bundle (often an Xcode extension or GUI application) and a standalone command-line tool:

Specify the directory containing binaries within the extracted archive, or where to place the downloaded file. This supports Tera templating with variables like {{ version }}, {{ os }}, {{ arch }}, and arch aliases ({{ darwin_os }}, {{ amd64_arch }}, {{ x86_64_arch }}, {{ gnu_arch }}):

Binary path lookup order:

Comma-separated list of binaries to symlink into a filtered .mise-bins directory. This is useful when the tool comes with extra binaries that you do not want to expose on PATH.

For other Forgejo compatible or self-hosted instances, specify the API URL. mise uses this URL for release listing and release asset lookup, and may also use it to download assets when browser download URLs are not reachable or when using custom/private instances:

If you are using a self-hosted Forgejo instance, set the api_url tool option and optionally the MISE_FORGEJO_ENTERPRISE_TOKEN environment variable for authentication:

When set, mise executes this command via sh -c and reads the token from stdout. The hostname is exposed as MISE_CREDENTIAL_HOST, making the command host-aware for self-hosted Forgejo environments. This replaces the git credential fill fallback and does not require forgejo.use_git_credentials to be enabled.

The command should print a single token to stdout. Trailing whitespace is trimmed.

Example: op read "op://Private/Forgejo Token/credential"

When enabled, mise will read tokens from the fj CLI keys file (~/.local/share/forgejo-cli/keys.json on Linux, ~/Library/Application Support/Cyborus.forgejo-cli/keys.json on macOS). This is used as a fallback when no FORGEJO_TOKEN or MISE_FORGEJO_TOKEN environment variable is set.

Set to false to disable this behavior.

When enabled, mise will run git credential fill to obtain Forgejo tokens using the credential helpers configured in your .gitconfig.

This covers tokens stored in system keyrings (macOS Keychain, Windows Credential Manager), and any other git credential helper.

Used as a last resort — after environment variables, forgejo_tokens.toml, and fj CLI tokens are checked. Results are cached per host for the duration of the session.

Set to true to enable this behavior.

**Examples:**

Example 1 (sass):
```sass
$ mise use -g forgejo:forgejo/runner[api_url=https://code.forgejo.org/api/v1,bin=forgejo-runner,bin=forgejo-runner]
$ forgejo-runner -v
forgejo-runner version v12.4.0
```

Example 2 (json):
```json
[tools]
"forgejo:forgejo/runner" = {
  version = "latest",
  api_url = "https://code.forgejo.org/api/v1",
  bin = "forgejo-runner",
}
```

Example 3 (unknown):
```unknown
export MISE_FORGEJO_TOKEN="forgejo-token"
```

Example 4 (unknown):
```unknown
export MISE_FORGEJO_ENTERPRISE_TOKEN="forgejo-enterprise-token"
```

---

## npm Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/npm.html

**Contents:**
- npm Backend ​
- Dependencies ​
- Usage ​
- Settings ​
  - npm.package_manager
- Lifecycle Scripts ​
  - aube ​
  - pnpm ​
  - bun ​
  - npm ​

You may install packages directly from npmjs.org even if there isn't an asdf plugin for it.

The code for this is inside of the mise repository at ./src/backend/npm.rs.

This relies on having npm installed for resolving package versions. With the default npm.package_manager = "auto" setting, mise uses aube for installing npm packages when it is installed, similar to how the pipx backend uses uv when available. If you use aube, pnpm, or bun as the package manager, that package manager must also be installed.

The npm backend forwards minimum_release_age to transitive dependency resolution during install. This relies on the configured package manager supporting its native release-age flag:

If you want transitive protection, install and use a package manager version that meets the corresponding requirement above. Older versions may fail while processing the forwarded argument.

Here is how to install npm with mise:

To install aube, pnpm, or bun:

The following installs the latest version of prettier and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

Set these with mise settings set [VARIABLE]=[VALUE] or by setting the environment variable listed.

Package manager to use for installing npm packages. The default, auto, uses aube when it is installed and falls back to npm, similar to how the pipx backend uses uv when available. Set this to npm, aube, bun, or pnpm to force a specific package manager.

The npm backend installs one global tool package at a time. Lifecycle scripts are package-provided commands such as preinstall, install, postinstall, and prepare; allowing them means allowing code from the selected package and its dependencies to run during installation.

With the default npm.package_manager = "auto" setting, mise installs through aube when aube is installed. If aube is not installed, mise installs through npm. Setting npm.package_manager = "aube", "pnpm", "bun", or "npm" chooses that package manager explicitly. The allow_builds, aube_args, pnpm_args, bun_args, and npm_args options only affect the package manager that is actually used; an approval option for one package manager does not change the behavior of another.

For tools that need reviewed dependency build scripts, use allow_builds with aube, pnpm, or npm 11.16.0+.

aube follows the pnpm v11 build approval model: dependency lifecycle scripts are denied unless explicitly allowlisted. Use allow_builds for reviewed dependency builds:

allow_builds is passed to aube add --global as one --allow-build=<pkg> flag per package. Use aube_args for other raw aube flags. Set allow_builds = true to pass --dangerously-allow-all-builds when you explicitly accept that every dependency build script may run.

pnpm uses build approval settings for dependency lifecycle scripts. Use allow_builds for reviewed dependency builds:

allow_builds is passed to pnpm add --global as one --allow-build=<pkg> flag per package. --allow-build was added in pnpm v10.4.0 and is supported by pnpm v10.4.0+ and v11.x. Set allow_builds = true to pass --dangerously-allow-all-builds when you explicitly accept that every dependency build script may run.

pnpm approve-builds was added in v10.1.0, but it is not recommended to run approve-builds from postinstall. pnpm approve-builds -g worked for global packages in pnpm v10.4.0 through v10.x and was removed in v11.0.0; use allow_builds = ["<pkg>"] for global installs with pnpm v10.4.0+ or v11.x.

bun does not execute arbitrary dependency lifecycle scripts by default. Bun's project install controls include trustedDependencies, bun add --trust, and bun pm trust, but the npm backend's Bun path is a global install and does not write a per-transitive trustedDependencies allowlist.

mise does not add Bun's --trust flag automatically. You can pass it explicitly with bun_args when you accept that broader install-time script trust:

npm normally runs lifecycle scripts by default. mise passes --ignore-scripts=true by default for npm-backed installs.

With npm 11.16.0+, allow_builds = ["<pkg>"] is passed as --allow-scripts=<pkg> for reviewed global installs. When allow_builds is used and npm supports --allow-scripts, mise does not pass --ignore-scripts=true because npm's ignore-scripts setting takes precedence over the allowlist.

Set allow_builds = true to pass --dangerously-allow-all-scripts when you explicitly accept that every dependency build script may run.

For older npm versions, mise keeps --ignore-scripts=true; use aube/pnpm, upgrade npm, or opt into npm's default script behavior with npm_args when you accept that every package in the install graph can run lifecycle scripts:

The following tool-options are available for the npm backend. These go in [tools] in mise.toml.

Packages whose dependency lifecycle build scripts should be approved when settings.npm.package_manager = "aube", "pnpm", or npm 11.16.0+. Use this instead of spelling out package-manager-specific approval flags in aube_args, pnpm_args, or npm_args.

For example, to allow one verified dependency build script:

For multiple reviewed dependency builds:

To allow all dependency build scripts for the install:

allow_builds does not affect bun installs because mise's Bun path is a global install and does not write a per-transitive trustedDependencies allowlist. For npm installs, allow_builds requires npm 11.16.0+.

Additional arguments to pass to aube add --global when settings.npm.package_manager = "aube". These are raw user-supplied arguments.

For example, to install npm with aube's append-only reporter mode:

Additional arguments to pass to pnpm installs when settings.npm.package_manager = "pnpm". These are raw user-supplied arguments.

For example, to set pnpm's log level:

Additional arguments to pass to bun installs when settings.npm.package_manager = "bun". These are raw user-supplied arguments. mise does not add --trust automatically.

For example, to pass Bun's broad trust flag:

Additional arguments to pass to npm installs when settings.npm.package_manager = "npm". These are raw user-supplied arguments. For example, to opt into npm lifecycle scripts:

**Examples:**

Example 1 (unknown):
```unknown
mise use -g node
```

Example 2 (markdown):
```markdown
mise use -g aube
# or
mise use -g pnpm
# or
mise use -g bun
```

Example 3 (unknown):
```unknown
$ mise use -g npm:prettier
$ prettier --version
3.1.0
```

Example 4 (json):
```json
[tools]
"npm:prettier" = "latest"
```

---

## Dev Tools | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/

**Contents:**
- Dev Tools ​
- How it works ​
  - Tool Resolution Flow ​
  - Environment Integration ​
  - Path Management ​
  - Configuration Hierarchy ​
- Tool Options ​
  - Table Format (Recommended) ​
  - Dotted Notation ​
  - Generic Nested Support ​

Install and switch between dev tools like node, python, cmake, terraform, and hundreds more, all from the same project config.

mise is a tool that manages installations of programming language runtimes and other tools for local development. For example, it can be used to manage multiple versions of Node.js, Python, Ruby, Go, etc. on the same machine.

Once activated, mise can automatically switch between different versions of tools based on the directory you're in. This means that if you have a project that requires Node.js 18 and another that requires Node.js 22, mise will automatically switch between them as you move between the two projects. See tools available for mise with in the registry.

To know which tool version to use, mise will typically look for a mise.toml file in the current directory and its parents. To get an idea of how tools are specified, here is an example of a mise.toml file:

It's also compatible with asdf .tool-versions files as well as idiomatic version files like .node-version and .ruby-version. See configuration for more details.

When specifying tool versions and tool options, you can also refer to environment variables or vars defined in your config hierarchy, including values produced by directives like _.source, _.file, or env modules. These are resolved before tool version and option templates are rendered.

mise is compatible with asdf .tool-versions files and can still use asdf plugins when needed. If you're migrating from asdf, see the comparison guide.

mise manages development tools through a sophisticated but user-friendly system that automatically handles tool installation, version management, and environment setup.

When you enter a directory or run a command, mise follows this process:

mise provides several ways to integrate with your development environment:

Automatic Activation: With mise activate, mise hooks into your shell prompt and automatically updates your environment when you change directories:

On-Demand Execution: Use mise exec to run commands with mise's environment without permanent activation:

Shims: mise can create lightweight wrapper scripts that automatically use the correct tool versions:

mise modifies your PATH environment variable to prioritize the correct tool versions:

This ensures that when you run node, you get the version specified in your project configuration, not a system-wide installation.

mise supports nested configuration that cascades from broad to specific settings:

Each level can override or extend the previous ones, giving you fine-grained control over tool versions across different contexts.

Tool options allow you to customize how tools are installed and configured. They support nested configurations for better organization, particularly useful for platform-specific settings.

The cleanest way to specify nested options is using TOML tables:

You can also use dotted notation for simpler nested configurations:

Any backend can use nested options for organizing complex configurations:

Internally, nested options are flattened to dot notation (e.g., platforms.macos-x64.url, database.host, cache.redis.port) for backend access.

Run a command immediately after a tool finishes installing by adding a postinstall field to that tool's configuration. This is separate from [hooks].postinstall and applies only to when a specific tool is installed.

You can restrict tools to specific operating systems using the os field:

The os field accepts an array of operating system identifiers:

You can also restrict tools to specific OS and architecture combinations using the os/arch syntax:

Supported architecture identifiers:

When an entry contains /, both the OS and architecture must match. When an entry is just an OS name, it matches any architecture on that OS.

If a tool specifies an os restriction and the current operating system is not in the list, mise will skip installing and using that tool.

You can declare explicit installation dependencies between tools using the depends field. This ensures that one tool is fully installed before another begins installing.

In this example, pipx:ruff will wait for python to finish installing before it starts.

The depends field accepts either a single string or an array of strings:

User-specified depends adds ordering constraints for tools already in the current install set. Use it when one configured tool install must finish before another configured tool install starts, especially when installs would otherwise run in parallel.

depends in [tools] only adds install graph ordering. It does not by itself declare hook-time dependencies or add those tools to the PATH used while vfox install hooks run.

For vfox plugins, declare install-hook tool requirements on the PLUGIN table in metadata.lua:

Use tool names as they would appear in mise.toml. When matching tools are configured, mise uses those metadata entries to order current install jobs and to build the hook environment. See Tool plugin development.

mise uses intelligent caching to minimize overhead:

This ensures that mise adds minimal latency to your daily development workflow.

After activating, mise will update env vars like PATH whenever the directory is changed or the prompt is displayed. See the FAQ.

After activating, every time your prompt displays it will call mise hook-env to fetch new environment variables. This should be very fast. It exits early if the directory wasn't changed or mise.toml/.tool-versions files haven't been modified.

mise modifies PATH ahead of time so the runtimes are called directly. This means that calling a tool has zero overhead and commands like which node returns the real path to the binary. Other tools like asdf only support shim files to dynamically locate runtimes when they're called which adds a small delay and can cause issues with some commands. See shims for more information.

Here are some of the most important commands when it comes to working with dev tools. Click the header for each command to go to its reference documentation page to see all available flags/options and more examples.

For some users, mise use might be the only command you need to learn. It will do the following:

mise use node@26 will install the latest version of node-26 and create/update the mise.toml config file in the local directory. The resulting file looks like this:

Anytime you're in that directory, that version of node will be used.

mise use -g node@26 will do the same but update the global config (~/.config/mise/config.toml) so unless there is a config file in the local directory hierarchy, node-26 will be the default version for the user.

You can also edit mise.toml directly instead of using mise use — the effect is the same. Run mise install after editing to install any new tools.

mise install will install but not activate tools—meaning it will download/build/compile the tool into ~/.local/share/mise/installs but you won't be able to use it without "setting" the version in a .mise-toml or .tool-versions file.

If you're coming from asdf, there is no need to also run mise plugin add to first install the plugin, that will be done automatically if needed. Of course, you can manually install plugins if you wish or you want to use a plugin not in the default registry.

There are many ways it can be used:

mise x can be used for one-off commands using specific tools. e.g.: if you want to run a script with python3.12:

Python will be installed if it is not already. mise x will read local/global .mise-toml/.tool-versions files as well, so if you don't want to use mise activate or shims you can use mise by just prefixing commands with mise x --:

If you use this a lot, an alias can be helpful:

Similarly, mise run can be used to execute tasks which will also activate the mise environment with all of your tools.

mise provides several mechanisms to automatically install missing tools or versions as needed. Below, these are grouped by how and when they are triggered, with relevant settings for each. All mechanisms require the global auto_install setting to be enabled (all auto_install settings are enabled by default).

When you run a command like mise x or mise r, mise will automatically install any missing tool versions required to execute the command.

If you type a command in your shell (e.g., node) and it is not found, mise can attempt to auto-install the missing tool version if it knows which tool provides that binary.

Disable auto_install for specific tools by setting auto_install_disable_tools to a list of tool names.

**Examples:**

Example 1 (json):
```json
[tools]
node = '24'
python = '3'
ruby = 'latest'
```

Example 2 (unknown):
```unknown
eval "$(mise activate zsh)"  # In your ~/.zshrc
cd my-project               # Automatically loads mise.toml tools
```

Example 3 (sql):
```sql
mise exec -- node my-script.js  # Runs with tools from mise.toml
```

Example 4 (unknown):
```unknown
mise activate --shims  # Creates shims instead of modifying PATH
```

---

## Tool Aliases | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/aliases.html

**Contents:**
- Tool Aliases ​
- Aliased Backends ​
- Aliased Versions ​
- Templates ​

[alias] has been renamed to [tool_alias] to distinguish it from [shell_alias]. The old [alias] key still works but is deprecated.

For shell command aliases (like alias ll='ls -la'), see Shell Aliases.

Tools can be aliased so that something like node which normally maps to core:node can be changed to a different backend instead.

mise supports aliasing the versions of runtimes. One use-case for this is to define a stable name that points to a specific version, so you can reference it symbolically in mise.toml/.tool-versions. For example, you may want lts-iron to map to Node.js 20 so you can set it with node = "lts-iron".

User aliases can be created by adding a tool_alias.<TOOL>.versions section to ~/.config/mise/config.toml:

Then reference the alias when pinning the tool:

Plugins can also provide aliases via a bin/list-aliases script. Here is an example showing node.js versions:

(mise's built-in node plugin already ships these LTS aliases; the example above shows the format that other plugins can use.)

Alias values can be templates, see Templates for details.

**Examples:**

Example 1 (elixir):
```elixir
[tool_alias]
node = 'github:company/our-custom-node'   # shorthand for https://github.com/company/our-custom-node
erlang = 'aqua:company/our-custom-erlang' # use an aqua registry entry
```

Example 2 (json):
```json
[tool_alias.node.versions]
lts-iron = '20'
```

Example 3 (json):
```json
[tools]
node = "lts-iron"
```

Example 4 (bash):
```bash
#!/usr/bin/env bash

echo "lts-krypton 24"
echo "lts-jod 22"
echo "lts-iron 20"
```

---

## SPM Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/spm.html

**Contents:**
- SPM Backend ​
- Dependencies ​
- Usage ​
  - Supported Syntax ​
- Tool Options ​
  - install_env ​
  - provider ​
  - api_url ​
  - artifactbundle ​
  - artifactbundle_asset ​

You may install executables managed by Swift Package Manager directly from GitHub or GitLab releases.

The code for this is inside of the mise repository at ./src/backend/spm.rs.

When a release publishes a SwiftPM artifact bundle (*.artifactbundle.zip), mise will use the prebuilt executable from the bundle when it matches the current Swift target triple. If no matching bundle is available, mise falls back to building the package from source unless artifact bundles are explicitly required.

This relies on having swift installed. You can either install it manually or with mise.

If you have Xcode installed and selected in your system via xcode-select, Swift is already available through the toolchain embedded in the Xcode installation.

The following installs the latest version of tuist and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

If the release provides only a SwiftPM artifact bundle, mise can install the bundle directly:

The version will be set in ~/.config/mise/config.toml with the following format:

Other syntax may work but is unsupported and untested.

The following tool-options are available for the backend — these go in [tools] in mise.toml.

Set environment variables for Swift Package Manager commands such as swift package dump-package, swift -print-target-info, and swift build. For artifact bundle installs, this only applies to swift -print-target-info; the download, extract, and symlink steps are handled by mise directly.

Set the provider type to use for fetching assets and release information. Either github or gitlab (default is github). Ensure the provider is set to the correct type if you use shorthand notation and api_url for self-hosted repositories as the type probably cannot be derived correctly from the URL.

Set the URL for the provider's API. This is useful when using a self-hosted instance.

Control whether SwiftPM artifact bundles are used. When unset, mise tries a matching *.artifactbundle.zip release asset first and falls back to building from source if no matching bundle is available.

Set artifactbundle = true to require an artifact bundle for a tool. If no bundle matches the current Swift target triple, installation fails instead of falling back to a source build.

Set artifactbundle = false to skip artifact bundles and always build from source.

Select a specific artifact bundle release asset. This is required when a release contains multiple *.artifactbundle.zip assets.

Restrict which executable products are installed from the package or artifact bundle. When unset, every executable product declared in Package.swift is built and symlinked into bin/, or every matching executable artifact from an artifact bundle is symlinked into bin/.

Useful when a package ships helper executables (e.g. test harnesses) that you don't want on your PATH. For source builds, filtering happens before swift build, so unwanted products are never built.

Accepts a TOML array or a comma-separated string. If any listed name does not match an executable product in the package, installation fails with a clear error.

Set spm.artifactbundle_only = true to require SwiftPM artifact bundles for all spm: installs. This mirrors cargo.binstall_only: mise will fail if no matching artifact bundle is available instead of compiling from source.

This can also be set with MISE_SPM_ARTIFACTBUNDLE_ONLY=1.

**Examples:**

Example 1 (lua):
```lua
$ mise use -g spm:tuist/tuist
$ tuist --help
OVERVIEW: Generate, build and test your Xcode projects.

USAGE: tuist <subcommand>
...
```

Example 2 (json):
```json
[tools]
"spm:tuist/tuist" = "latest"
```

Example 3 (elixir):
```elixir
mise use -g spm:giginet/swift-testing-revolutionary@0.4.0
swift-testing-revolutionary --help
```

Example 4 (json):
```json
[tools]
"spm:giginet/swift-testing-revolutionary" = "0.4.0"
```

---

## GitLab Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/gitlab.html

**Contents:**
- GitLab Backend ​
- Usage ​
- Authentication ​
  - Token priority ​
  - Environment variables ​
  - Token file (gitlab_tokens.toml) ​
  - credential_command ​
  - glab CLI integration ​
  - git credential fill fallback ​
  - Debugging token resolution ​

You may install GitLab release assets directly using the gitlab backend. This backend downloads release assets from GitLab repositories and is ideal for tools that distribute pre-built binaries through GitLab releases.

The code for this is inside of the mise repository at ./src/backend/github.rs.

The following installs the latest version of gitlab-runner from GitLab releases and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

For private repositories or higher API limits, mise supports several GitLab token sources.

mise checks these sources in order and uses the first token found:

For self-hosted GitLab instances:

You can provide a shell command that prints a token to stdout:

mise executes this command with the configured default inline shell. The target hostname is available as MISE_CREDENTIAL_HOST, and the provider name (gitlab) is available as MISE_CREDENTIAL_PROVIDER. For compatibility, recognized sh-compatible shells (ash, bash, dash, ksh, sh, and zsh) also receive the hostname as $1/${1}.

The legacy $1/${1} hostname argument is deprecated. Use MISE_CREDENTIAL_HOST instead. mise will start warning in 2026.11.0, and $1 compatibility will be removed in 2027.11.0.

mise can read tokens from glab config as a fallback. It checks:

Disable this fallback with:

As a last resort, mise can query git credential helpers:

This uses git credential fill and supports credentials stored by helpers such as macOS Keychain.

Use mise token gitlab to see which token mise would use for a given host:

The following tool-options are available for the gitlab backend—these go in [tools] in mise.toml.

When no asset_pattern is specified, mise automatically selects the best asset for your platform. The system scores assets based on:

For most tools, you can simply install without specifying patterns:

The autodetection logic is implemented in src/backend/asset_matcher.rs, which is shared by the GitHub, GitLab, and Forgejo backends.

Specifies the pattern to match against release asset names. This is useful when there are multiple assets for your OS/arch combination or when you need to override autodetection.

Narrows asset selection to names containing the given substring, while keeping platform autodetection. Unlike asset_pattern (which replaces autodetection entirely), matching only refines the candidate set — autodetection still chooses the correct OS/arch from the narrowed list, so a single config stays portable across platforms.

This is the option to reach for when a repository ships multiple binaries as separate per-platform assets and autodetection can't tell which one you want.

Tool options can also be passed inline on the command line using [key=value] syntax:

matching is a case-sensitive substring test, so a value that is also a substring of another asset's name (e.g. matching = "tool" when both tool-* and tool-extras-* are published) won't uniquely select your binary. Use matching_regex with an anchor when you need a precise match.

If asset_pattern is also set, it takes precedence and matching/matching_regex are ignored — asset_pattern replaces autodetection entirely, so there is no candidate set left for them to narrow. They are ignored silently: when asset_pattern is set, a matching_regex is never consulted and an invalid one is not reported, since mise does not error on a superseded option.

Like matching, but the asset name must match the given regular expression. Use this when a substring isn't selective enough. The match is case-sensitive; use an inline (?i) flag for case-insensitive matching.

If both matching and matching_regex are set, an asset must satisfy both (logical AND) to remain a candidate.

matching/matching_regex are not part of the install path — it is keyed by the tool name (owner/repo, or a tool_alias) and version. To install two binaries from the same release, give each its own tool_alias so they get distinct install directories; reusing the same gitlab:owner/repo string with different matching values resolves to the same directory and the second install overwrites the first.

Specifies a custom version prefix for release tags. By default, mise handles the common v prefix (e.g., v1.0.0), but some repositories use different prefixes like release-, version-, or no prefix at all.

When version_prefix is configured, mise will:

For different asset patterns per platform:

Verify the downloaded file with a checksum:

Instead of specifying the checksum here, you can use mise.lock to manage checksums.

Verify the downloaded asset size:

You can specify different sizes for different platforms:

Number of directory components to strip when extracting archives:

If strip_components is not explicitly set, mise will automatically detect when to apply strip_components = 1. This happens when the extracted archive contains exactly one directory at the root level and no files. This is common with tools like ripgrep that package their binaries in a versioned directory (e.g., ripgrep-14.1.0-x86_64-unknown-linux-musl/rg). The auto-detection ensures the binary is placed directly in the install path where mise expects it.

Rename the downloaded binary to a specific name. This is useful when downloading single binaries that have platform-specific names:

When downloading single binaries (not archives), mise automatically removes OS/arch suffixes from the filename. For example, mytool-linux-x86_64 becomes mytool automatically. Use the bin option only when you need a specific custom name.

Rename the executable after extraction from an archive. This is useful when the archive contains a binary with a platform-specific name that you want to rename:

Use rename_exe for archives where the binary inside has a different name than desired. Use bin for single binary downloads (non-archives).

Skip macOS .app bundle assets during autodetection and prefer standalone CLI binaries instead. This is useful when a repository provides both a macOS .app bundle (often an Xcode extension or GUI application) and a standalone command-line tool:

Specify the directory containing binaries within the extracted archive, or where to place the downloaded file. This supports Tera templating with variables like {{ version }}, {{ os }}, {{ arch }}, and arch aliases ({{ darwin_os }}, {{ amd64_arch }}, {{ x86_64_arch }}, {{ gnu_arch }}):

Binary path lookup order:

Comma-separated list of binaries to symlink into a filtered .mise-bins directory. This is useful when the tool comes with extra binaries that you do not want to expose on PATH.

For self-hosted GitLab instances, specify the API URL. mise uses this URL for release listing and release asset lookup, and may also use it to download assets when browser download URLs are not reachable or when using custom/private instances:

If you want to install a tool from a private repository on gitlab.com, set the MISE_GITLAB_TOKEN environment variable for authentication:

If you are using a self-hosted GitLab instance, set the api_url tool option and optionally the MISE_GITLAB_ENTERPRISE_TOKEN environment variable for authentication:

When set, mise executes this command via sh -c and reads the token from stdout. The hostname is exposed as MISE_CREDENTIAL_HOST, making the command host-aware for self-managed GitLab environments. This replaces the git credential fill fallback and does not require gitlab.use_git_credentials to be enabled.

The command should print a single token to stdout. Trailing whitespace is trimmed.

Example: op read "op://Private/GitLab Token/credential"

When enabled, mise will read tokens from the glab CLI config file (~/.config/glab-cli/config.yml or $GLAB_CONFIG_DIR/config.yml) as a fallback when no GITLAB_TOKEN or MISE_GITLAB_TOKEN environment variable is set.

Set to false to disable this behavior.

When enabled, mise will run git credential fill to obtain GitLab tokens using the credential helpers configured in your .gitconfig.

This covers tokens stored in system keyrings (macOS Keychain, Windows Credential Manager), and any other git credential helper.

Used as a last resort — after environment variables, gitlab_tokens.toml, and glab CLI tokens are checked. Results are cached per host for the duration of the session.

Set to true to enable this behavior.

**Examples:**

Example 1 (unknown):
```unknown
$ mise use -g gitlab:gitlab-org/gitlab-runner
$ gitlab-runner --version
gitlab-runner 16.8.0
```

Example 2 (json):
```json
[tools]
"gitlab:gitlab-org/gitlab-runner" = { version = "latest", asset_pattern = "gitlab-runner-linux-x64" }
```

Example 3 (unknown):
```unknown
export MISE_GITLAB_TOKEN="glpat-xxxxxxxx"
```

Example 4 (unknown):
```unknown
export MISE_GITLAB_ENTERPRISE_TOKEN="glpat-yyyyyyyy"
```

---

## HTTP Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/http.html

**Contents:**
- HTTP Backend ​
- Usage ​
- Supported HTTP Syntax ​
- Tool Options ​
  - url (Required) ​
    - Template Variables ​
  - Platform-specific URLs ​
  - checksum ​
  - Platform-specific Checksums ​
  - checksum_url ​

You may install tools directly from HTTP URLs using the http backend. This backend downloads files from any HTTP/HTTPS URL and is ideal for tools that distribute pre-built binaries or archives through direct download links.

The code for this is inside of the mise repository at ./src/backend/http.rs.

The following installs a tool from a direct HTTP URL:

The version will be set in ~/.config/mise/config.toml with the following format:

The following tool-options are available for the http backend—these go in [tools] in mise.toml.

Specifies the HTTP URL to download the tool from. The URL supports templating with variables like version, os(), and arch():

You can also use static URLs without templating:

The following template functions are available in URLs (use double curly braces, e.g., version becomes {{version}}):

The os() and arch() functions support remapping for tools that use different naming conventions:

This produces URLs like:

For tools that need different downloads per platform, use the table format:

You can use either macos or darwin, and x64 or amd64 for platform keys. macos and x64 are preferred in documentation and examples, but all variants are accepted.

OS/architecture values use mise's conventions: linux, macos, windows for operating systems and x64, arm64 for architectures. For platform-specific URLs, use the appropriate platform key (e.g., macos-x64, linux-arm64) and specify the full URL for each platform.

If you mess up and use something like darwin-aarch64 mise will try to figure out what you meant and do the right thing anyhow.

Verify the downloaded file with a checksum:

Instead of specifying the checksum here, you can use mise.lock to manage checksums.

URL of a published checksum source. When set, mise lock resolves checksums for every target platform — including platforms other than the one you are running on — without downloading the artifacts. This lets a single machine produce a complete, cross-platform lockfile.

checksum_url is a template (supports {{ version }}, {{ os() }}, {{ arch() }} and is platform-specific via platforms.<key>.checksum_url). It may point at any of:

For individual and SHASUMS checksum files, the algorithm is detected from the file's name (*.sha512, SHA512SUMS, *.md5, *.b3, defaulting to sha256).

When the checksum lives in a manifest (rather than a plain checksum file), use checksum_expr to extract it. The manifest body fetched from checksum_url is evaluated with expr-lang. The following variables are available: body (the raw manifest), version, os, arch, url (the resolved artifact URL for the target), and filename.

The expression must evaluate to a qualified algo:hash string (e.g. sha256:<hash>, sha512:<hash>). Build the prefix in the expression: prepend a literal when the algorithm is fixed ("sha256:" + entry.hash), or read it from the manifest when it varies (entry.algo + ":" + entry.hash).

The predicate placeholder must be written as { #... } with a space after {, because {# is the Tera comment delimiter. To index a map by a runtime value, force evaluation with [version + ""] — a bare [version] is treated as the literal key "version".

Verify the downloaded file size:

You can specify different sizes for different platforms:

Number of directory components to strip when extracting archives:

If strip_components is not explicitly set, mise will automatically detect when to apply strip_components = 1. This happens when the extracted archive contains exactly one directory at the root level and no files. This is common with tools like ripgrep that package their binaries in a versioned directory (e.g., ripgrep-14.1.0-x86_64-unknown-linux-musl/rg). The auto-detection ensures the binary is placed directly in the install path where mise expects it.

Rename the downloaded binary to a specific name. This is useful when downloading single binaries that have platform-specific names:

When downloading single binaries (not archives), mise automatically removes OS/arch suffixes from the filename. For example, docker-compose-linux-x86_64 becomes docker-compose automatically. Use the bin option only when you need a specific custom name.

Rename the executable inside an extracted archive to a specific name. This is useful when archives contain binaries with platform-specific names or when installing kubectl plugins that need specific naming:

This works by searching for the first executable in the extracted directory (or bin_path if specified) and renaming it to the specified name.

Use bin for renaming single binary downloads, and rename_exe for renaming executables inside archives.

Explicitly specify the archive format when the URL lacks a file extension or has an incorrect extension:

If format is not specified, mise will automatically detect the format from the file extension in the URL. Only use format when the URL doesn't have a proper extension or when you need to override the detected format.

You can specify different formats for different platforms:

Fetch available versions from a remote URL. This enables mise ls-remote to list available versions for HTTP-based tools:

The version list URL can return data in multiple formats:

Version prefixes like v are automatically stripped.

Extract versions from the version list URL response using a regular expression:

The first capturing group is used as the version. If no capturing group is present, the entire match is used.

Extract versions from JSON responses using a jq-like path expression:

Supported path expressions:

The filter syntax [?field=value] allows filtering JSON arrays before extraction. This is useful for APIs that return multiple release channels (stable, beta, dev) and you only want specific ones.

Extract versions using an expr-lang expression. This provides the most flexibility for complex version extraction logic:

The expression receives the HTTP response body as the body variable and should return an array of version strings.

The expr-lang library provides built-in functions including:

version_expr takes precedence over version_regex and version_json_path if multiple are specified. Use it when the other options aren't flexible enough for your use case.

Specify the directory containing binaries within the extracted archive, or where to place the downloaded file. This supports templating with {{version}}:

Binary path lookup order:

The HTTP backend implements an intelligent caching system to optimize disk usage and installation speed:

Downloaded and extracted files are cached in $MISE_CACHE_DIR/http-tarballs/ instead of being stored separately for each tool installation. By default:

Cache keys are generated based on the file content to ensure identical downloads are shared across tools:

Example cache directory structure:

Tool installations are symlinks to the cached extracted content:

This approach provides several benefits:

Each cache entry includes a metadata.json file with information about the cached content:

The HTTP backend cache follows mise's standard cache management:

**Examples:**

Example 1 (sass):
```sass
mise use -g http:my-tool[url=https://example.com/releases/my-tool-v1.0.0.tar.gz]@1.0.0
```

Example 2 (json):
```json
[tools]
"http:my-tool" = { version = "1.0.0", url = "https://example.com/releases/my-tool-v1.0.0.tar.gz" }
```

Example 3 (json):
```json
[tools]
"http:my-tool" = { version = "1.0.0", url = "https://example.com/releases/my-tool-v{{version}}.tar.gz" }
```

Example 4 (json):
```json
[tools]
"http:my-tool" = { version = "1.0.0", url = "https://example.com/releases/my-tool-v1.0.0.tar.gz" }
```

---

## GitHub Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/github.html

**Contents:**
- GitHub Backend ​
- Usage ​
- Tool Options ​
  - Asset Autodetection ​
  - asset_pattern ​
  - matching ​
  - matching_regex ​
  - version_prefix ​
  - Platform-specific Asset Patterns ​
  - Multiple Assets from the Same Release ​

You may install GitHub release assets directly using the github backend. This backend downloads release assets from GitHub repositories and is ideal for tools that distribute pre-built binaries through GitHub releases.

The code for this is inside of the mise repository at ./src/backend/github.rs.

The following installs the latest version of ripgrep from GitHub releases and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

The following tool-options are available for the github backend—these go in [tools] in mise.toml.

When no asset_pattern is specified, mise automatically selects the best asset for your platform. The system scores assets based on:

For most tools, you can simply install without specifying patterns:

The autodetection logic is implemented in src/backend/asset_matcher.rs, which is shared by the GitHub, GitLab, and Forgejo backends.

Specifies the pattern to match against release asset names. This is useful when there are multiple assets for your OS/arch combination or when you need to override autodetection.

Narrows asset selection to names containing the given substring, while keeping platform autodetection. Unlike asset_pattern (which replaces autodetection entirely), matching only refines the candidate set — autodetection still chooses the correct OS/arch from the narrowed list, so a single config stays portable across platforms.

This is the option to reach for when a repository ships multiple binaries as separate per-platform assets and autodetection can't tell which one you want (see Multiple Assets from the Same Release).

Tool options can also be passed inline on the command line using [key=value] syntax:

matching is a case-sensitive substring test, so a value that is also a substring of another asset's name (e.g. matching = "tool" when both tool-* and tool-extras-* are published) won't uniquely select your binary. Use matching_regex with an anchor when you need a precise match.

If asset_pattern is also set, it takes precedence and matching/matching_regex are ignored — asset_pattern replaces autodetection entirely, so there is no candidate set left for them to narrow. They are ignored silently: when asset_pattern is set, a matching_regex is never consulted and an invalid one is not reported, since mise does not error on a superseded option.

The filter also scopes verification: checksums are looked up for the selected asset, and SLSA provenance discovery is narrowed the same way, so a multi-binary release can't verify one binary against another's provenance. A single shared provenance file that attests every artifact in the release (e.g. multiple.intoto.jsonl) is still used as a fallback when no per-binary provenance matches.

Like matching, but the asset name must match the given regular expression. Use this when a substring isn't selective enough. The match is case-sensitive; use an inline (?i) flag for case-insensitive matching.

If both matching and matching_regex are set, an asset must satisfy both (logical AND) to remain a candidate.

Specifies a custom version prefix for release tags. By default, mise handles the common v prefix (e.g., v1.0.0), but some repositories use different prefixes like release-, version-, or no prefix at all.

When version_prefix is configured, mise will:

For different asset patterns per platform:

The GitHub backend installs one release asset for each tool. If a repository publishes multiple binaries as separate assets in the same release, define one tool alias per binary and point each alias at the same github:owner/repo backend, then narrow each alias to its binary.

Prefer matching (or matching_regex): it narrows the candidate set while keeping platform autodetection, so one config works on every OS/arch. This is the right choice when the per-platform asset names can't be templated portably (e.g. Rust target-triples like oxlint-aarch64-apple-darwin.tar.gz).

The example below installs both oxlint and oxfmt from the single oxc-project/oxc release. Note that each matching value must be specific enough to select only the intended binary — if one binary's name were a substring of the other's, use matching_regex with an anchor (e.g. "^oxlint-") instead (see the matching caveat).

A distinct alias per binary is required, not just tidy. matching/matching_regex are not part of the install path — it is keyed by the tool name (the alias, or owner/repo when unaliased) and version. Installing the same github:owner/repo backend string twice with different matching values (for example mise use "github:owner/repo[matching=tool-a]" followed by mise use "github:owner/repo[matching=tool-b]") resolves to the same directory, so the second install overwrites the first. Giving each binary its own alias gives each its own install directory, so they coexist.

If the binary isn't named the way you want to invoke it, add rename_exe (renames the executable extracted from an archive) or bin (selects/renames the binary, including a single bare non-archive binary).

Use asset_pattern instead only when you need full manual control and can name the asset portably (it replaces autodetection, so any / templating must cover every platform you target):

Verify the downloaded file with a checksum:

Instead of specifying the checksum here, you can use mise.lock to manage checksums.

Verify the downloaded asset size:

Number of directory components to strip when extracting archives:

If strip_components is not explicitly set, mise will automatically detect when to apply strip_components = 1. This happens when the extracted archive contains exactly one directory at the root level and no files. This is common with tools like ripgrep that package their binaries in a versioned directory (e.g., ripgrep-14.1.0-x86_64-unknown-linux-musl/rg). The auto-detection ensures the binary is placed directly in the install path where mise expects it.

Rename the downloaded binary to a specific name. This is useful when downloading single binaries that have platform-specific names:

When downloading single binaries (not archives), mise automatically removes OS/arch suffixes from the filename. For example, docker-compose-linux-x86_64 becomes docker-compose automatically. Use the bin option only when you need a specific custom name.

Rename the executable after extraction from an archive. This is useful when the archive contains a binary with a platform-specific name that you want to rename:

Use rename_exe for archives where the binary inside has a different name than desired. Use bin for single binary downloads (non-archives).

Skip macOS .app bundle assets during autodetection and prefer standalone CLI binaries instead. This is useful when a repository provides both a macOS .app bundle (often an Xcode extension or GUI application) and a standalone command-line tool:

Without this option, mise's autodetection might select .app bundles on macOS, which can be problematic if the bundle contains a GUI application or Xcode extension rather than a standalone CLI tool.

Specify the directory containing binaries within the extracted archive, or where to place the downloaded file. This supports Tera templating with variables like {{ version }}, {{ os }}, {{ arch }}, and arch aliases ({{ darwin_os }}, {{ amd64_arch }}, {{ x86_64_arch }}, {{ gnu_arch }}):

Binary path lookup order:

Comma-separated list of binaries to symlink into a filtered .mise-bins directory. This is useful when the tool comes with extra binaries that you do not want to expose on PATH.

For GitHub Enterprise or self-hosted GitHub instances, specify the API URL. mise uses this URL for release listing and release asset lookup, and may also use it to download assets when browser download URLs are not reachable or when using custom/private instances:

By default, mise checks GitHub Artifact Attestations when they are available for a GitHub release asset. Set github_attestations = false on a single tool to skip that check while keeping GitHub attestation verification enabled globally:

Use this as a temporary escape hatch for a specific tool if GitHub's attestation service or trusted-root data is causing installs to fail. Other verification paths, such as checksums and SLSA provenance, still run when they are configured and available. If mise.lock already records github-attestations provenance for the tool, re-run mise lock after disabling this option so the lockfile no longer requires a verifier that the tool config has turned off.

By default, releases flagged prerelease: true on GitHub are excluded from mise ls-remote and from latest resolution. Set prerelease = true to include them:

Useful for repositories whose active releases are all pre-releases (e.g. internal tools shipping continuous dev builds), or when you need to track a project's release candidates. Draft releases are always excluded. Has no effect on GitLab.

If you are using a self-hosted GitHub instance, set the api_url tool option. For authentication, see GitHub Tokens.

When set, mise executes this command via sh -c and reads the token from stdout. The hostname is exposed as MISE_CREDENTIAL_HOST, making the command host-aware for GitHub Enterprise environments. This replaces the git credential fill fallback and does not require github.use_git_credentials to be enabled.

The command should print a single token to stdout. Trailing whitespace is trimmed.

Example: op read "op://Private/GitHub Token/credential"

When enabled, mise will read OAuth tokens from the gh CLI config file (~/.config/gh/hosts.yml or $GH_CONFIG_DIR/hosts.yml) as a fallback when no GITHUB_TOKEN or MISE_GITHUB_TOKEN environment variable is set.

This supports multiple GitHub Enterprise instances since the gh CLI stores per-host tokens.

Set to false to disable this behavior.

Enable/disable GitHub Artifact Attestations verification for github backend tools. When enabled, mise will verify the authenticity and integrity of downloaded tools using GitHub's artifact attestation system.

Attestations are only verified when the tool resolves to the public GitHub API (https://api.github.com). Tools that set a custom api_url (e.g. GitHub Enterprise Server) skip attestation verification automatically since GHE Server does not implement the attestations endpoint.

GitHub API base URL used to validate native OAuth tokens and associate them with the configured host.

OAuth endpoint base URL used by native GitHub device flow. The default is for github.com. Set this for GitHub Enterprise instances that support device flow.

When set, mise can create short-lived GitHub App user access tokens using GitHub's OAuth device flow. This does not require a GitHub App private key, client secret, personal access token, or external credential helper.

Run mise token github --oauth once to authorize and cache a token. mise will reuse the cached token for GitHub API calls and refresh it when possible.

When github.oauth_client_id is configured and a cached or refreshable token is available, mise exports the token under this environment variable so other tools (gh, git, cargo, etc.) can pick it up without an explicit $(mise token github --oauth --raw) call. Set to GH_TOKEN to use the gh CLI's preferred name, or to an empty string to disable the auto-export.

When enabled, mise token github --oauth will attempt to open GitHub's verification URL in the default browser when the device-code flow is triggered.

Optional OAuth scope string passed to GitHub's device-code endpoint. GitHub App user access tokens are primarily governed by the app's permissions and installation access, so this usually remains empty.

Enable/disable SLSA provenance verification for github backend tools. When enabled, mise will verify the supply-chain integrity of downloaded tools using SLSA provenance attestations.

When enabled, mise will run git credential fill to obtain GitHub tokens using the credential helpers configured in your .gitconfig.

This covers tokens stored in system keyrings (macOS Keychain, Windows Credential Manager), and any other git credential helper.

Used as a last resort — after environment variables, github_tokens.toml, and gh CLI tokens are checked. Results are cached per host for the duration of the session.

Set to true to enable this behavior.

**Examples:**

Example 1 (unknown):
```unknown
$ mise use -g github:BurntSushi/ripgrep
$ rg --version
ripgrep 14.1.1
```

Example 2 (json):
```json
[tools]
"github:BurntSushi/ripgrep" = "latest"
```

Example 3 (unknown):
```unknown
mise install github:user/repo
```

Example 4 (json):
```json
[tools]
"github:cli/cli" = { version = "latest", asset_pattern = "gh_*_linux_x64.tar.gz" }
```

---

## mise oci | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/mise-oci.html

**Contents:**
- mise oci experimental ​
- Commands at a glance ​
- Quick start ​
- How layering works ​
- mise oci build ​
- mise oci run ​
- mise oci push ​
  - [oci] section in mise.toml ​
  - [bootstrap] and [dotfiles] in OCI images ​
  - Settings ​

mise oci build turns a mise.toml into a container image, with one OCI layer per installed tool.

The payoff is that bumping any single tool version only invalidates one content-addressable blob. With a Dockerfile, each RUN install_tool is stacked on the one before it — changing an early RUN invalidates every later layer. mise's on-disk layout (every tool installed in an isolated $MISE_DATA_DIR/installs/<plugin>/<version>/ directory) makes layer ordering semantically irrelevant, so swapping a tool's version swaps a single layer and everything else (the base image, other tools, mise itself, image config) is reused unchanged.

mise oci build is experimental. Enable it with:

Flags, output layout, and defaults may change in future releases.

Given this mise.toml:

mise oci build produces layers roughly like this:

Bumping node from 20.10 to 20.11 only invalidates the node layer. Python, jq, mise, the base, and the synthesized config are reused from the previous build (or from the registry, on pull).

Build (or reuse) an image and run a command inside it, like docker run / podman run. Stdin/stdout/stderr are inherited.

Requirements: either podman (native OCI-layout support) or docker + skopeo (skopeo loads the layout into the docker daemon).

Build (or reuse) an image and push it to a registry via skopeo or crane. mise never handles credentials itself — configure the underlying tool (docker login, REGISTRY_AUTH_FILE, crane auth login, etc.).

<REGISTRY_REF> — fully-qualified destination (e.g. ghcr.io/me/devenv:latest). Must include a registry host.

--tool — auto (default, prefers skopeo), skopeo, or crane.

--image-dir — push an existing OCI layout instead of building.

--owner UID[:GID] — numeric owner for generated layer entries when building fresh; it cannot be combined with --image-dir.

[oci].user sets the image USER directive. [oci].user_id and [oci].group_id set layer file ownership; if no group_id is configured, it defaults to the resolved user_id.

CLI flags override the [oci] section. The [oci] section overrides the oci.default_from / oci.default_mount_point settings.

When mise.toml files are layered (global + project), sections are merged field-by-field with the more specific file winning per field.

mise oci build applies project-scoped [bootstrap.packages] and [dotfiles] entries to the image. This is the OCI equivalent of the declarative package and dotfile parts of mise bootstrap. Pass --include-global to also include [bootstrap.packages] and [dotfiles] from global configs.

For packages, OCI builds currently support apt: entries with a Debian/Ubuntu base image. mise unpacks the base image into a temporary rootfs, calls the host apt-get to install into that rootfs, then emits the filesystem changes as one OCI layer annotated with dev.mise.system.packages=apt. Other system package managers are rejected for OCI builds for now.

For image builds, symlink and symlink-each entries are copied as file content. Host symlinks would usually point back to the checkout path and be broken inside the container, so the image receives the resolved contents instead. Targets beginning with ~/ are written under /root/.

[bootstrap.macos.defaults] and the imperative bootstrap task are not run by mise oci build. macOS defaults do not apply to Linux OCI images, and container-specific startup work belongs in the image entrypoint or command.

The default base is glibc-based on purpose. Alpine / musl would break most mise-installed prebuilt binaries (Node, Python wheels, Ruby gems). If you know your tools are statically linked you can opt in with --from alpine:… — expect trouble otherwise.

The image config's Env is built in this order (later entries win):

Secrets in [env] are baked into the image

Anything in your mise [env] section — including values loaded from .env files — is written into the image config JSON and visible to anyone who runs docker inspect / skopeo inspect. Do not put secrets there. Use docker run -e, secret mounts, or orchestrator secrets at runtime. Use [oci].env only for values that are safe to live in the image.

mise emits a warning listing the count of [env] vars it baked in.

All of mise's first-party backends install entirely under their per-version install directory, so they work as per-tool layers:

core, aqua, cargo, npm, go, pipx, github, gitlab, forgejo, ubi, spm, http, s3, gem, conda, dotnet.

Not supported in v1: asdf and vfox plugins (including third-party vfox plugins). Their install scripts can write outside the per-version directory, breaking the one-layer-per-tool invariant. Using them errors out with a clear message.

v1 can pull base images from any OCI Distribution v2 registry that accepts anonymous pulls:

Authenticated pulls (private base images) are a follow-up.

Digest references are supported:

On the same host, re-running mise oci build with unchanged inputs produces byte-identical tool layer digests. Across machines, layer digests may drift because compiled artifacts (pyc bytecode, generated node-gyp output, etc.) can embed absolute paths.

For fully-reproducible image config timestamps, set SOURCE_DATE_EPOCH:

OCI images are linux-targeted. Building on macOS or Windows produces an image whose os field is linux, but any embedded binaries (mise and every tool layer) are still host-native — they will fail with Exec format error when executed inside the container.

For a working image, run mise oci build on a linux host (or inside a linux container — docker run -v $PWD:/src -w /src debian mise oci build works). mise prints a warning when this mismatch is detected.

**Examples:**

Example 1 (sass):
```sass
mise settings experimental=true
# or, per-invocation:
MISE_EXPERIMENTAL=1 mise oci build …
```

Example 2 (julia):
```julia
# Build an image from the current mise.toml using the default base
# (debian:bookworm-slim). Output goes to ./mise-oci/.
mise oci build

# Run an interactive shell in the image (uses podman if present, else
# docker + skopeo).
mise oci run -it -- bash

# Push to a registry (shells out to skopeo; falls back to crane).
mise oci push ghcr.io/me/devenv:latest

# You can also go through skopeo/crane manually:
skopeo inspect oci:./mise-oci
skopeo copy oci:./mise-oci docker://ghcr.io/me/devenv:latest
```

Example 3 (json):
```json
[tools]
node = "20"
python = "3.12"
jq = "1.8.1"
```

Example 4 (sql):
```sql
mise oci build [-o PATH] [--from REF] [--tag REF] [--mount-point PATH]
               [--no-mise] [--owner UID[:GID]]
```

---

## Backend Architecture | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backend_architecture.html

**Contents:**
- Backend Architecture ​
- What are Backends? ​
- The Backend Trait System ​
- Backend Types ​
  - Core Tools ​
  - Language Package Managers ​
  - Universal Installers ​
    - aqua - Comprehensive Package Manager ​
    - ubi - Universal Binary Installer (Deprecated) ​
  - Plugin Systems ​

Understanding how mise's backend system works can help you choose the right backend for your tools and troubleshoot issues when they arise. Most users don't need to explicitly choose backends since the mise registry defines smart defaults, but understanding the system helps when you need specific tools or want to optimize performance.

Backends are mise's way of supporting different tool installation methods. Each backend knows how to:

Think of backends as "adapters" that let mise work with different package managers and installation systems.

All backends implement a common interface (called a "trait" in Rust), which means they all provide the same basic functionality:

This design allows mise to treat all backends uniformly while each backend handles the specifics of its installation method.

Built directly into mise, written in Rust for performance and reliability:

Core tools like Node.js and Java are implemented as backends even though they represent single tools. This consistent backend architecture allows mise to handle all tools uniformly, whether they're complex ecosystems or individual tools.

Leverage existing language ecosystems:

Registry-based package manager with strong security features:

The ubi backend is deprecated. Use the github backend instead.

Zero-configuration installer that works with any GitHub/GitLab repository following standard conventions:

Support for external plugin ecosystems:

When you specify a tool, mise determines the backend using this priority:

The mise registry defines a priority order for which backend to use for each tool, so typically end-users don't need to know which backend to choose unless they want tools not available in the registry or want to override the default selection.

You can override the backend for any tool using the MISE_BACKENDS_<TOOL> environment variable pattern. The tool name is converted to SHOUTY_SNAKE_CASE (uppercase with underscores replacing hyphens).

The registry (mise registry) maps short names to full backend specifications with a preferred priority order:

Core tools should generally always be used when available, as they provide the best performance and integration with mise.

The ubi backend still works but is deprecated in favor of github. Replace ubi:owner/repo with github:owner/repo.

Some backends have dependencies on others:

mise automatically handles these dependencies, installing Node.js before npm tools, pipx before pipx tools, etc.

Some backends support additional configuration:

**Examples:**

Example 1 (rust):
```rust
pub trait Backend {
    async fn list_remote_versions(&self) -> Result<Vec<String>>;
    async fn install_version(&self, ctx: &InstallContext, tv: &ToolVersion) -> Result<()>;
    async fn uninstall_version(&self, tv: &ToolVersion) -> Result<()>;
    // ... other methods
}
```

Example 2 (elixir):
```elixir
# Use vfox backend for php
export MISE_BACKENDS_PHP='vfox:mise-plugins/vfox-php'
mise install php@latest
```

Example 3 (elixir):
```elixir
# ~/.config/mise/config.toml
[tool_alias]
go = "core:go"                    # Use core backend
terraform = "aqua:hashicorp/terraform"  # Use aqua backend
```

Example 4 (elixir):
```elixir
# ~/.config/mise/config.toml
[settings]
disable_backends = ["asdf", "vfox"] # Don't use these backends
```

---

## asdf Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/asdf.html

**Contents:**
- asdf Backend ​
- Feature Comparison: asdf vs vfox ​
- Hook Migration: asdf to vfox ​
- Writing asdf (legacy) plugins for mise ​
- Tool Options ​
  - install_env ​

asdf plugins are considered legacy. New asdf and vfox plugins are not accepted into the mise registry for supply-chain security reasons — for registry submissions use the aqua (preferred) or github backend instead.

If you are writing a private/custom plugin (not for registry submission), prefer vfox plugins over asdf — they're written in Lua, work cross-platform (including Windows), and have access to built-in modules for HTTP, JSON, HTML parsing, and more.

asdf is the original backend for mise.

It relies on asdf plugins for each tool. asdf plugins are more risky to use because they're typically written by a single developer unrelated to the tool vendor. They also generally do not function on Windows because they're written in bash which is often not available on Windows and the scripts generally are not written to be cross-platform.

asdf plugins are not used for tools inside the registry whenever possible. Sometimes it is not possible to use more secure backends like aqua/github because tools have complex install setups or need to export env vars.

All of these are hosted in the mise-plugins org to secure the supply chain so you do not need to rely on plugins maintained by anyone except me.

Because of the extra complexity of asdf tools and security concerns we are actively moving tools in the registry away from asdf where possible to backends like aqua and github which don't require plugins. That said, not all tools can function with github/aqua if they have a unique installation process or need to set env vars other than PATH.

See the asdf documentation for more information on writing plugins.

The following tool-options are available for the asdf backend—these go in [tools] in mise.toml.

Set environment variables for asdf plugin install scripts:

**Examples:**

Example 1 (json):
```json
[tools]
"asdf:owner/plugin" = { version = "latest", install_env = { MAKEFLAGS = "-j8" } }
```

---

## gem Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/gem.html

**Contents:**
- gem Backend ​
- Dependencies ​
- Usage ​
- Ruby upgrades ​
- Settings ​
- Tool Options ​
  - install_env ​

mise can be used to install CLIs from RubyGems. The code for this is inside of the mise repository at ./src/backend/gem.rs.

This relies on having gem (provided with ruby) installed. You can install it with or without mise. Here is how to install ruby with mise:

The following installs the latest version of rubocop and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

If the ruby version used by a gem package changes, (by mise or system ruby), you may need to reinstall the gem. This can be done with:

Or you can reinstall all gems with:

Set these with mise settings set [VARIABLE]=[VALUE] or by setting the environment variable listed.

No settings available.

The following tool-options are available for the gem backend—these go in [tools] in mise.toml.

Set environment variables for the gem install command:

**Examples:**

Example 1 (unknown):
```unknown
mise use -g ruby
```

Example 2 (unknown):
```unknown
mise use -g gem:rubocop
rubocop --version
```

Example 3 (json):
```json
[tools]
"gem:rubocop" = "latest"
```

Example 4 (unknown):
```unknown
mise install -f gem:rubocop
```

---

## pkgx Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/pkgx.html

**Contents:**
- pkgx Backend experimental ​
- Usage ​
- Lockfiles ​
- Notes ​

The pkgx backend installs packages from the pkgx pantry without shelling out to the pkgx CLI. mise resolves pantry metadata, downloads pkgx bottles from dist.pkgx.dev, verifies bottle checksums when available, and writes wrapper scripts that set the package runtime environment.

This backend is experimental. Enable it with:

Or set MISE_EXPERIMENTAL=1 for a single shell/session.

Install a pkgx package by its pantry project name:

The version will be set in mise.toml with the following format:

The pkgx backend supports mise.lock. Locking records the main bottle URL and checksum on the tool entry, and records transitive pkgx dependencies in the shared [pkgx-packages] lockfile section.

When --locked is enabled, mise requires a lockfile URL for the current platform and will fail instead of doing a live pantry resolution if the lockfile is missing or incomplete.

**Examples:**

Example 1 (sass):
```sass
mise settings experimental=true
```

Example 2 (elixir):
```elixir
mise use pkgx:stedolan.github.io/jq@1.7.1
jq --version
```

Example 3 (json):
```json
[tools]
"pkgx:stedolan.github.io/jq" = "1.7.1"
```

Example 4 (unknown):
```unknown
mise lock
mise install --locked
```

---

## Dotnet backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/dotnet.html

**Contents:**
- Dotnet backend ​
- Usage ​
  - Supported Dotnet Syntax ​
- Settings ​
  - dotnet.cli_telemetry_optout
  - dotnet.dotnet_root
  - dotnet.isolated
  - dotnet.package_flagsdeprecated
  - dotnet.registry_url
- Tool Options ​

The code for this is inside the mise repository at ./src/backend/dotnet.rs.

The dotnet backend requires having the .NET runtime installed. You can install it using mise:

This will install the .NET runtime, which is required for dotnet tools to work properly.

The following installs the latest version of GitVersion.Tool and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

The version will be set in ~/.config/mise/config.toml with the following format:

Set these with mise settings set [VARIABLE]=[VALUE] or by setting the environment variable listed.

When set to true, the DOTNET_CLI_TELEMETRY_OPTOUT environment variable is set to 1, disabling .NET CLI telemetry. When set to false, it is set to 0.

When unset (default), mise does not set the variable and .NET uses its own default behavior.

All .NET SDK versions are installed side-by-side under this directory, matching .NET's native multi-version model.

By default, mise uses ~/.local/share/mise/dotnet-root. Set this to override the location.

When true, each SDK version is installed in its own directory under mise's installs path, like most other tools. dotnet --list-sdks will only show the active version.

When false (default), all SDK versions share a single DOTNET_ROOT directory and dotnet --list-sdks shows all installed versions, matching .NET's native side-by-side model.

Deprecated. Use the prerelease = true tool option on a dotnet: tool, or the global prereleases setting, to include pre-release versions.

This legacy setting is a list of flags to extend the search and install abilities of dotnet tools. Because it is global, remove it before relying on prerelease = false per-tool opt-outs. The only supported flag is:

URL to fetch dotnet tools from. This is used when installing dotnet tools.

By default, mise will use the nuget API to fetch.

However, you can set this to a different URL if you have a custom feed or want to use a different source.

The following tool-options are available for the dotnet backend—these go in [tools] in mise.toml.

Set environment variables for the dotnet tool install command:

By default, NuGet pre-release versions are excluded from mise ls-remote and from latest resolution. Set prerelease = true to include them:

The legacy dotnet.package_flags = ["prerelease"] setting is deprecated. Prefer the per-tool prerelease = true option, or the global prereleases setting when every tool should include pre-release versions. Because dotnet.package_flags is global, remove it before relying on prerelease = false per-tool opt-outs.

**Examples:**

Example 1 (elixir):
```elixir
# Install the latest version
mise use dotnet

# Or install a specific version (8, 9, etc.)
mise use dotnet@8
mise use dotnet@9
```

Example 2 (elixir):
```elixir
$ mise use dotnet:GitVersion.Tool@5.12.0
$ dotnet-gitversion /version
5.12.0+Branch.support-5.x.Sha.3f75764963eb3d7956dcd5a40488c074dd9faf9e
```

Example 3 (json):
```json
[tools]
"dotnet:GitVersion.Tool" = "5.12.0"
```

Example 4 (sass):
```sass
$ mise use dotnet:GitVersion.Tool
$ dotnet-gitversion /version
6.1.0+Branch.main.Sha.8856e3041dbb768118a55a31ad4e465ae70c6767
```

---

## Vfox Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/vfox.html

**Contents:**
- Vfox Backend ​
- Why vfox? ​
- Dependencies ​
- Usage ​
- Default plugin backend ​
- Plugins ​
  - Example: Plugin Usage ​
  - Install from Zip File ​
- Tool Options ​
  - install_env ​

Vfox is the recommended plugin system for mise. It provides cross-platform support, built-in modules, and a modern hook-based architecture.

Vfox plugins may be used in mise to install tools.

The code for this is inside the mise repository at ./src/backend/vfox.rs.

No extra system packages are required to run the vfox backend. Vfox Lua code is executed by the interpreter built into mise.

The following installs the latest version of cmake and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

On Windows, mise uses vfox plugins by default. If you'd like to use plugins by default even on Linux/macOS, set the following settings:

Now you can list available plugins with mise registry:

And they will be installed when running commands such as mise use -g cmake without needing to specify vfox:cmake.

In addition to the standard vfox plugins, mise supports modern plugins that can manage multiple tools using the plugin:tool format. These plugins are perfect for:

For more information, see:

The following tool-options are available for the vfox backend—these go in [tools] in mise.toml.

Set environment variables for commands that a vfox plugin starts with cmd.exec during install hooks. vfox's built-in Lua HTTP, archive, and JSON helpers do not use these variables directly.

**Examples:**

Example 1 (unknown):
```unknown
$ mise use -g vfox:version-fox/vfox-cmake
$ cmake --version
cmake version 3.21.3
```

Example 2 (json):
```json
[tools]
"vfox:version-fox/vfox-cmake" = "latest"
```

Example 3 (unknown):
```unknown
mise settings add disable_backends asdf
```

Example 4 (unknown):
```unknown
$ mise registry | grep vfox:
clang                         vfox:mise-plugins/vfox-clang
cmake                         vfox:mise-plugins/vfox-cmake
crystal                       vfox:mise-plugins/vfox-crystal
dart                          vfox:mise-plugins/vfox-dart
dotnet                        vfox:mise-plugins/vfox-dotnet
etcd                          aqua:etcd-io/etcd vfox:mise-plugins/vfox-etcd
flutter                       vfox:mise-plugins/vfox-flutter
gradle                        aqua:gradle/gradle vfox:mise-plugins/vfox-gradle
groovy                        vfox:mise-plugins/vfox-groovy
kotlin                        vfox:mise-plugins/vfox-kotlin
maven                         aqua:apache/maven vfox:mise-plugins/vfox-maven
php                           vfox:mise-plugins/vfox-php
scala                         vfox:mise-plugins/vfox-scala
terraform                     aqua:hashicorp/terraform vfox:mise-plugins/vfox-terraform
vlang                         vfox:mise-plugins/vfox-vlang
```

---

## Deps | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/deps.html

**Contents:**
- Deps experimental ​
- Quick Start ​
- Configuration ​
- Built-in Providers ​
- Adding and Removing Packages ​
- Custom Providers ​
  - Provider Options ​
- Freshness Checking ​
- Auto-Install ​
- Staleness Warnings ​

The mise deps command manages project dependencies by hashing source files (e.g., package-lock.json) and running install commands when changes are detected. It can also add and remove individual packages.

Configure deps providers in mise.toml:

mise includes built-in providers for common package managers:

Built-in providers are only active when explicitly configured in mise.toml and their lockfile exists.

The mise deps add and mise deps remove commands let you manage individual packages using the ecosystem:package syntax:

The ecosystem prefix tells mise which package manager to use. Currently supported ecosystems for add/remove: npm, yarn, pnpm, bun, deno, aube, dart, flutter.

Create custom providers for project-specific build steps:

mise uses blake3 content hashing to determine if sources have changed since the last successful run. Hashes are stored in $MISE_STATE_DIR/deps/<hash>.toml, keyed by project root (so nothing is written inside the project directory).

When auto = true is set on a provider, it will automatically run before:

This ensures dependencies are always up-to-date before running tasks or commands.

To skip auto-install for a single invocation:

When using mise activate, mise will warn you if any auto-enabled providers have stale dependencies:

This can be disabled with:

Providers can declare dependencies on other providers using the depends field. A provider will wait for all its dependencies to complete successfully before running.

In this example, ansible-galaxy will wait for uv to finish before starting.

Providers without depends run in parallel as before. If a dependency fails, all providers that depend on it are skipped. Circular dependencies are detected and the affected providers are skipped with a warning.

Deps providers run in parallel, respecting the jobs setting for concurrency limits. This speeds up installation when multiple providers need to run (e.g., both npm and pip). Providers with depends will wait for their dependencies to complete before starting, while independent providers run concurrently.

Running mise deps will install npm and poetry dependencies in parallel, then run prisma and frontend-codegen (also in parallel, since they only depend on npm, not each other).

**Examples:**

Example 1 (sass):
```sass
# Enable experimental features
export MISE_EXPERIMENTAL=1

# Install all project dependencies
mise deps

# Add a package
mise deps add npm:react

# Add a dev dependency
mise deps add -D npm:vitest

# Remove a package
mise deps remove npm:lodash
```

Example 2 (go):
```go
# Built-in npm provider (auto-detects lockfile)
[deps.npm]
auto = true  # Auto-run before mise x/run

# Built-in providers for other package managers
[deps.yarn]
[deps.pnpm]
[deps.bun]
[deps.deno]
[deps.aube]
[deps.go]
[deps.pip]
[deps.poetry]
[deps.uv]
[deps.bundler]
[deps.composer]

# Disable specific providers
[deps]
disable = ["npm"]
```

Example 3 (elixir):
```elixir
# Add packages
mise deps add npm:react
mise deps add npm:@types/react@19
mise deps add -D npm:vitest        # dev dependency

# Remove packages
mise deps remove npm:lodash
```

Example 4 (json):
```json
[deps.codegen]
sources = ["schema/*.graphql", "codegen.yml"]
outputs = ["src/generated/"]
run = "npm run codegen"
description = "Generate GraphQL types"

[deps.prisma]
sources = ["prisma/schema.prisma"]
outputs = ["node_modules/.prisma/"]
run = "npx prisma generate"
```

---

## mise.lock Lockfile | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/mise-lock.html

**Contents:**
- mise.lock Lockfile ​
- Overview ​
- Enabling Lockfiles ​
- How It Works ​
- File Format ​
  - Platform Information ​
  - Tool Entry Fields ​
  - Platform Keys ​
- Environment-Specific Lockfiles ​
- Local Lockfiles ​

mise.lock is a lockfile that pins exact versions and checksums of tools for reproducible environments. Lockfiles are not created automatically—you must run mise lock to generate them. Once a lockfile exists, mise will keep it updated as tools are installed or upgraded.

The lockfile serves similar purposes to package-lock.json in npm or Cargo.lock in Rust:

Lockfiles are controlled by the lockfile setting:

mise.lock is a TOML file with a platform-based format that organizes asset information by platform:

Each platform in a tool's [tools.name.platforms] section uses a key format like "os-arch" (e.g., "linux-x64", "macos-arm64") and can contain:

Each tool entry ([[tools.name]]) can contain:

The platform key format is generally os-arch but can be customized by backends:

When using environment-specific configuration files (e.g., mise.test.toml), each environment gets its own lockfile:

For example, with MISE_ENV=test:

Tools from mise.toml go to mise.lock, tools from mise.test.toml go to mise.test.lock.

Resolution: When MISE_ENV=test, mise reads mise.test.lock for tools defined in mise.test.toml and mise.lock for tools in mise.toml. Environment-specific lockfiles are strictly scoped to their corresponding config — they only contain tools defined in that config.

This design means CI environments that don't set MISE_ENV only depend on mise.lock, so dev tool version bumps in mise.dev.lock won't invalidate CI caches.

Both mise.lock and mise.<env>.lock files should be committed to version control. mise.local.lock and mise.<env>.local.lock should be gitignored alongside their corresponding config files.

Tools defined in mise.local.toml (which is typically gitignored) use a separate mise.local.lock file. This keeps local tool configurations separate from the committed lockfile.

Use mise lock --local to update the local lockfile for all platforms:

When monorepo_root = true, mise can use a single lockfile at the monorepo root. Set [monorepo] lockfile = true to opt into root lockfile variants such as mise.lock, mise.ci.lock, and mise.local.lock.

Existing subproject lockfiles are migrated into the root lockfile on the next lock-aware command. Unset keeps per-subproject lockfiles during the rollout. Monorepos using mise*.lock files start warning in mise 2026.12.0, and unset defaults to root lockfiles in mise 2027.6.0. Older mise versions do not understand this layout for subproject-owned tools, so projects that need mixed-version compatibility can pin the old behavior:

See Monorepo Tasks for details.

The locked setting enforces that all tools have pre-resolved URLs in the lockfile before installation. This prevents API calls to GitHub, aqua registry, etc., ensuring fully reproducible installations.

All mise settings are global in scope. Setting locked = true in a project's mise.toml applies to all tool resolution, including tools from your global ~/.config/mise/config.toml. If you see warnings about global tools missing from the lockfile, run mise lock -g to generate a global lockfile.

When enabled, mise install will fail if a tool doesn't have a URL for the current platform in the lockfile. To fix this, first populate the lockfile with URLs:

This is useful for CI environments where you want to guarantee reproducible builds without any external API dependencies.

When you want to update tool versions:

You can pin a specific version in the lockfile while keeping a fuzzy specifier in mise.toml:

If the version doesn't match the current config prefix, the config is updated automatically. For example, if mise.toml has node = "20" and you run mise upgrade node@22.15.0, the config is bumped to node = "22" (preserving the same precision level) and the lockfile is set to 22.15.0.

The table below shows how each command interacts with mise.toml and mise.lock:

Backend support for lockfile features varies:

If checksums become invalid or you need to regenerate them:

Precompiled Ruby binaries can have build revision releases for the same Ruby version. The lockfile keeps version = "3.3.11" but pins the selected build revision in the platform url:

Here 3.3.11-1 is build revision 1. See Ruby precompiled build revisions for details on why revisions exist, how unlocked installs behave, and how to update older lockfiles.

When merging branches with different lockfiles:

When mise lock generates a lockfile, it records a verified provenance type (e.g., slsa, cosign, minisign, github-attestations) for each tool when one is available. For the current platform, mise downloads the artifact and performs full cryptographic verification at lock time -- ensuring the provenance entry in the lockfile is backed by actual verification, not just registry metadata. This applies to both the aqua and github backends. For cross-platform entries, provenance is detected from registry metadata without verification (since the artifact may not be runnable on the current machine).

By default, when mise install sees a lockfile with both a checksum and a verified provenance entry, it trusts the lockfile and skips re-verification. This avoids redundant API calls (e.g., GitHub attestation queries) which can cause rate limit issues in CI. Since the current platform's provenance was already verified during mise lock, this is safe.

If GitHub Artifact Attestations are enabled but the GitHub API confirms none exist for a checksum-backed artifact, mise may record github_attestations = "unavailable". This is a negative cache entry, not provenance: it only skips the redundant GitHub attestation probe on later installs from that lockfile. Other verification paths such as SLSA, Cosign, Minisign, and checksum verification still run as usual.

GitHub's docs show binary attestations generated from an existing artifact path with actions/attest, and the REST API lists attestations by subject digest. That means an attestation can appear after the release asset was uploaded. A later mise lock run or MISE_LOCKED_VERIFY_PROVENANCE=1 mise install can discover attestations added after the lockfile recorded them as unavailable.

For additional security, you can force provenance re-verification at install time on every install:

Or via environment variable:

This is also automatically enabled in paranoid mode:

When enabled, every mise install will cryptographically verify provenance regardless of what the lockfile contains, ensuring the artifact was built by a trusted CI pipeline.

In addition to lockfiles, mise uses the minimum_release_age setting to limit supply chain risk by only installing versions that have been available for a minimum amount of time. It defaults to 24h:

This pairs well with lockfiles — use minimum_release_age to avoid picking up brand-new releases, and lockfiles to pin the exact versions you've vetted.

This setting filters top-level fuzzy version resolution for backends that provide release timestamps. Versions without timestamps are included by default.

Only npm: and pipx: currently forward the same cutoff into transitive dependency resolution during install. Other backends may select an older top-level tool version, but they do not constrain dependencies fetched by the tool's installer/compiler.

**Examples:**

Example 1 (sass):
```sass
# Enable lockfiles globally
mise settings lockfile=true

# Or set in mise.toml
[settings]
lockfile = true
```

Example 2 (lua):
```lua
# Example mise.lock
[[tools.node]]
version = "20.11.0"
backend = "core:node"

[tools.node.platforms.linux-x64]
checksum = "sha256:a6c213b7a2c3b8b9c0aaf8d7f5b3a5c8d4e2f4a5b6c7d8e9f0a1b2c3d4e5f6a7"
size = 23456789
url = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz"

[[tools.python]]
version = "3.11.7"
backend = "core:python"

[tools.python.platforms.linux-x64]
checksum = "sha256:def456..."
size = 12345678

# Tool with backend-specific options
[[tools.ripgrep]]
version = "14.1.1"
backend = "aqua:BurntSushi/ripgrep"
options = { exe = "rg" }

[tools.ripgrep.platforms.linux-x64]
checksum = "sha256:4cf9f2741e6c465ffdb7c26f38056a59e2a2544b51f7cc128ef28337eeae4d8e"
size = 1234567
```

Example 3 (sass):
```sass
MISE_ENV=test mise lock  # creates mise.lock AND mise.test.lock
```

Example 4 (elixir):
```elixir
# mise.local.toml tools go to mise.local.lock
mise use --path mise.local.toml node@22

# Regular mise.toml tools go to mise.lock
mise use --path mise.toml node@20
```

---

## GitHub Tokens | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/github-tokens.html

**Contents:**
- GitHub Tokens ​
- Token Priority ​
- Setting a Token via Environment Variable ​
- Token File (github_tokens.toml) ​
- gh CLI Integration ​
- Credential Command ​
  - Using ghtkn ​
- Native GitHub OAuth ​
- Git Credential Helpers ​
- Debugging Token Resolution ​

Many tools in mise are hosted on GitHub. For public releases, mise uses mise-versions by default as a shared cache for version lists, release metadata, and GitHub artifact attestations. This avoids most unauthenticated GitHub API calls during normal installs, including CI and Docker builds.

GitHub tokens are still useful when mise has to fall back to GitHub's API, when MISE_USE_VERSIONS_HOST=0 is set, or when installing tools from private repositories, GitHub Enterprise, or custom GitHub API hosts. Unauthenticated requests are subject to low rate limits, which can cause 403 Forbidden errors. This page explains how to configure GitHub authentication in mise.

mise checks the following sources in order. The first token found wins:

GitHub Enterprise hosts:

The github.com env vars (MISE_GITHUB_TOKEN, etc.) are also used as a fallback for GHE when MISE_GITHUB_ENTERPRISE_TOKEN is not set. If you need different tokens for github.com and a GHE instance, set MISE_GITHUB_ENTERPRISE_TOKEN explicitly or use the gh CLI integration.

Create a personal access token (no scopes required) and set it:

Or, if you already have GITHUB_TOKEN set (common in GitHub Actions), mise will use it automatically.

You can store per-host GitHub tokens in a mise-specific config file:

This file is checked after environment variables and credential_command but before the gh CLI's hosts.yml, making it useful when:

The file location follows MISE_CONFIG_DIR (defaults to ~/.config/mise). No additional settings are required — mise auto-discovers the file if it exists.

If you use the GitHub CLI (gh), mise can read tokens directly from its hosts.yml config file. This is enabled by default and kicks in when no token environment variable is set.

mise looks for hosts.yml in these locations (first match wins):

This is especially useful for GitHub Enterprise — the gh CLI stores per-host tokens, so mise can authenticate to multiple GHE instances without juggling environment variables:

mise reads the config file directly — it does not shell out to gh. If your gh CLI uses a credential helper (e.g., macOS Keychain) instead of storing tokens in hosts.yml, the token won't be available via this method. However, mise also supports git credential fill (see below), which can retrieve tokens from system keyrings.

To disable this behavior:

You can configure a custom shell command that mise runs to obtain a GitHub token. This is useful when you want a credential source that only mise uses, without affecting git:

mise executes this command with the configured default inline shell (unix_default_inline_shell_args or windows_default_inline_shell_args) and reads the token from stdout. The hostname is available as MISE_CREDENTIAL_HOST, and the provider name (github) is available as MISE_CREDENTIAL_PROVIDER. For compatibility, recognized sh-compatible shells (ash, bash, dash, ksh, sh, and zsh) also receive the hostname as $1/${1}. This is checked before github_tokens.toml and gh CLI tokens, so it takes priority over file-based sources.

The legacy $1/${1} hostname argument is deprecated. Use MISE_CREDENTIAL_HOST instead. mise will start warning in 2026.11.0, and $1 compatibility will be removed in 2027.11.0.

ghtkn can generate short-lived GitHub App user access tokens and print them to stdout, which makes it compatible with credential_command.

Run ghtkn get once manually before relying on it from mise so any browser-based device flow happens intentionally. After that, ghtkn can reuse tokens from your OS secret manager until they need to be regenerated.

The credential command runs with mise shims removed from PATH to avoid recursive mise invocations. If you install ghtkn with mise, use mise which to find the real executable path and store that in credential_command instead of relying on the shim:

Do not make the credential command run mise x, mise exec, or another command that may need GitHub access to resolve or install ghtkn, since that can loop while mise is trying to obtain the GitHub token.

If ghtkn is already available without relying on a mise shim, you can also set it directly:

Use mise token github to confirm mise can resolve the token:

mise can create short-lived GitHub App user access tokens directly with GitHub's OAuth device flow. This does not require a personal access token, GitHub App private key, app client secret, gh, ghtkn, or any other external credential command.

The design was inspired by ghtkn — if you'd rather run a separate process and have mise pick up its token via credential_command, see Using ghtkn above.

Create a GitHub App with device flow enabled, then configure its client ID:

After that, mise reuses the cached token for its own GitHub API calls and refreshes it when GitHub returns a refresh token. While the cached token is valid, mise also exports it to your shell as GITHUB_TOKEN (via mise activate / mise hook-env / mise env / mise exec) so tools like gh, git, and cargo publish see it without any extra wiring:

To use a different variable name (for example, gh's preferred GH_TOKEN), set github.oauth_export_env. Setting it to an empty string disables the auto-export.

You can still print a raw token explicitly when you need to pipe it somewhere:

mise can use your existing git credential helpers to obtain GitHub tokens. This is opt-in and acts as a last-resort fallback after all other token sources.

This is especially useful for:

mise runs git credential fill with GIT_TERMINAL_PROMPT=0 (to prevent interactive prompts) and caches the result per host for the session.

To enable this behavior:

Use mise token github to see which token mise would use for a given host:

For self-hosted GitHub instances, set the api_url tool option on the tool:

For authentication, mise checks (in order):

If you have multiple GHE instances, MISE_GITHUB_ENTERPRISE_TOKEN (a single value) won't work. Use github_tokens.toml, the gh CLI integration, credential_command, or git credential helpers instead:

If you use mise.lock, mise stores exact download URLs and checksums. Future installs use the lockfile directly — no GitHub API calls needed:

This is the best approach for CI where you want deterministic builds without configuring tokens. See mise.lock Lockfile for details.

In GitHub Actions, GITHUB_TOKEN is automatically available. mise picks it up with no extra configuration:

For private repos or higher rate limits, use a fine-grained personal access token stored as a repository secret.

mise also supports .netrc for HTTP Basic auth. Credentials from .netrc take precedence over token-based auth headers. See URL Replacements for details.

**Examples:**

Example 1 (unknown):
```unknown
export MISE_GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
```

Example 2 (json):
```json
# ~/.config/mise/github_tokens.toml
[tokens."github.com"]
token = "ghp_xxxxxxxxxxxx"

[tokens."github.mycompany.com"]
token = "ghp_yyyyyyyyyyyy"
```

Example 3 (sass):
```sass
# ~/.config/gh/hosts.yml (managed by `gh auth login`)
github.com:
  oauth_token: ghp_xxxxxxxxxxxx
  user: you
github.mycompany.com:
  oauth_token: ghp_yyyyyyyyyyyy
  user: you
```

Example 4 (json):
```json
[settings.github]
gh_cli_tokens = false
```

---

## Comparison to asdf | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/comparison-to-asdf.html

**Contents:**
- Comparison to asdf ​
- Migrate from asdf to mise ​
- asdf in go (0.16+) ​
- Supply chain security ​
- UX ​
- Performance ​
- Windows support ​
- Security ​
- Command Compatibility ​
- Extra backends ​

mise can be used as a drop-in replacement for asdf. It supports the same .tool-versions files that you may have used with asdf and can use asdf plugins through the asdf backend.

It will not, however, reuse existing asdf directories (so you'll need to either reinstall them or move them), and 100% compatibility is not a design goal. That said, if you're coming from asdf-bash (0.15 and below), mise actually has fewer breaking changes than asdf-go (0.16 and above) despite 100% compatibility not being a design goal of mise.

Casual users coming from asdf have generally found mise to just be a faster, easier to use asdf.

Make sure you have a look at environments and tasks which are major portions of mise that have no asdf equivalent.

If you're moving from asdf to mise, please review #how-do-i-migrate-from-asdf for guidance.

asdf has gone through a rewrite in go. Because this is quite new as of this writing (2025-01-01), I'm going to keep information about 0.16+ asdf versions (which I call "asdf-go" vs "asdf-bash") in this section and the rest of this doc will apply to asdf-bash (0.15 and below).

In terms of performance, mise is still faster than the go asdf, however the difference is much closer. asdf is likely fast enough that the difference in overhead between asdf-go and mise may not even be enough to notice for you—after all there are plenty of people still using asdf-bash that claim they don't even notice how slow it is (don't ask me how):

I don't think performance is a good enough reason to switch though now that asdf-go is a thing. It's a reason, but it's a minor one. The improved security in mise, better DX, and lack of reliance on shims are all more important than performance.

Given they went through the trouble of rewriting asdf—that's also an indication they want to keep working on it (which is awesome that they're doing that btw). This does mean that some of what's written here may go out of date if they address some of the problems with asdf.

asdf plugins are not secure. This is explained in SECURITY.md, but the quick explanation is that asdf plugins involve shell code which can essentially do anything on your machine. It's dangerous code. What's worse is asdf plugins are rarely written by the tool vendor (who you need to trust anyway to use the tool), which means for every asdf plugin you use you'll be trusting a random developer to not go rogue and to not get hacked themselves and publish changes to a plugin with an exploit.

mise still uses asdf plugins for some tools, but we're actively reducing that count as well as moving things into the mise-plugins org. It looks like asdf has a similar model with their asdf-community org, but it isn't. asdf gives plugin authors commit access to their plugin in asdf-community when they move it in, which I feel like defeats the purpose of having a dedicated org in the first place. By the end of 2025 I would like for there to no longer be any asdf plugins in the registry that aren't owned by me.

I've also been adopting extra security verification steps when vendors offer that ability such as gpg verification on node installs, and native Cosign/SLSA/Minisign/GitHub attestation verification for aqua tools.

Some commands are the same in asdf but others have been changed. Everything that's possible in asdf should be possible in mise but may use slightly different syntax. mise has more forgiving commands, such as using fuzzy-matching, e.g.: mise install node@20. While in asdf you can run asdf install node latest:20, you can't use latest:20 in a .tool-versions file or many other places. In mise you can use fuzzy-matching everywhere.

asdf requires several steps to install a new runtime if the plugin isn't installed, e.g.:

In mise this can all be done in a single step which installs the plugin, installs the runtime, and sets the version:

If you have an existing .tool-versions file, or .mise.toml, you can install all plugins and runtimes with a single command:

I've found asdf to be particularly rigid and difficult to learn. It also made strange decisions like having asdf list all but asdf latest --all (why is one a flag and one a positional argument?). mise makes heavy use of aliases so you don't need to remember if it's mise plugin add node or mise plugin install node. If I can guess what you meant, then I'll try to get mise to respond in the right way.

That said, there are a lot of great things about asdf. It's the best multi-runtime manager out there and I've really been impressed with the plugin system. Most of the design decisions the authors made were very good. I really just have 2 complaints: the shims and the fact it's written in Bash.

asdf made (what I consider) a poor design decision to use shims that go between a call to a runtime and the runtime itself. e.g.: when you call node it will call an asdf shim file ~/.asdf/shims/node, which then calls asdf exec, which then calls the correct version of node.

These shims have terrible performance, adding ~120ms to every runtime call. mise activate does not use shims and instead updates PATH so that it doesn't have any overhead when simply calling binaries. These shims are the main reason that I wrote this. Note that in the demo GIF at the top of this README that mise isn't actually used when calling node -v for this reason. The performance is identical to running node without using mise.

I don't think it's possible for asdf to fix these issues. The author of asdf did a great writeup of performance problems. asdf is written in bash which certainly makes it challenging to be performant, however I think the real problem is the shim design. I don't think it's possible to fix that without a complete rewrite.

mise does call an internal command mise hook-env every time the directory has changed, but because it's written in Rust, this is very quick—taking ~10ms on my machine. 4ms if there are no changes, 14ms if it's a full reload.

tl;dr: asdf adds overhead (~120ms) when calling a runtime, mise adds a small amount of overhead (~ 5ms) when the prompt loads.

asdf does not run on Windows at all. With mise, tools using non-asdf backends can support Windows. Of course, this means the tool vendor must provide Windows binaries but if they do, and the backend isn't asdf, the tool should work on Windows.

asdf plugins are insecure. They typically are written by individuals with no ties to the vendors that provide the underlying tool. Where possible, mise does not use asdf plugins and instead uses backends like aqua and github which do not require separate plugins.

Aqua tools include native Cosign/SLSA/Minisign/GitHub attestation verification built into mise. See SECURITY for more information.

In nearly all places you can use the exact syntax that works in asdf, however this likely won't show up in the help or CLI reference. If you're coming from asdf and comfortable with that way of working you can almost always use the same syntax with mise, e.g.:

UPDATE (2025-01-01): asdf-go (0.16+) actually got rid of asdf global|local entirely in favor of asdf set which we can't support since we already have a command named mise set. mise command compatibility will likely not be as good with asdf-go 0.16+.

It's not recommended though. You almost always want to modify config files and install things so mise use node@20 saves an extra command. Also, the "@" in the command is preferred since it allows you to install multiple tools at once: mise use|install node@20 node@18. Also, there are edge cases where it's not possible—or at least very challenging—for us to definitively know which syntax is being used and so we default to mise-style. While there aren't many of these, asdf-compatibility is done as a "best-effort" in order to make transitioning from asdf feel familiar for those users who can rely on their muscle memory. Ensuring asdf-syntax works with everything is not a design goal.

mise has support for backends other than asdf plugins. For example you can install CLIs directly from cargo and npm:

**Examples:**

Example 1 (json):
```json
asdf plugin add node
asdf install node latest:20
asdf local node latest:20
```

Example 2 (elixir):
```elixir
mise use node@20
```

Example 3 (unknown):
```unknown
mise install
```

Example 4 (unknown):
```unknown
mise install node 20.0.0
mise local node 20.0.0
```

---

## pipx Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/pipx.html

**Contents:**
- pipx Backend ​
- Dependencies ​
- Usage ​
- Python upgrades ​
  - Supported Pipx Syntax ​
- Settings ​
  - pipx.registry_url
  - pipx.uvx
- Tool Options ​
  - install_env ​

pipx is a tool for running Python CLIs in isolated virtualenvs. This is necessary for Python CLIs because it prevents conflicting dependencies between CLIs or between a CLI and Python projects. In essence, this backend lets you add Python CLIs to mise.

To be clear, pipx is not pip and it's not used to manage Python dependencies generally. mise is a tool manager, not a dependency manager like pip, uv, or poetry. You can, however, use mise to install said package managers. You'd want to use the pipx backend to install a CLI like "black", not a library like "NumPy" or "requests".

Somewhat confusingly, the pipx backend will actually default to using uvx (the equivalent of pipx for uv) if uv is installed. This should just mean that it installs much faster, but see below to disable or configure since occasionally tools don't work with uvx.

The pipx backend supports the following sources:

The code for this is inside of the mise repository at ./src/backend/pipx.rs.

This relies on having uv (recommended) or pipx installed.

If you have uv installed, mise will use uv tool install under the hood and you don't need to install pipx to run the commands containing "pipx:".

mise forwards minimum_release_age to transitive Python dependency resolution during install. The uv install path uses uv's --exclude-newer flag and requires uv >= 0.2.22. The pipx fallback passes pip's --uploaded-prior-to flag.

In case you need pipx for other reasons, you can install it with or without mise. Here is how to install pipx with mise:

Other installation instructions

The following installs the latest version of black and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

If the python version used by a pipx package changes, (by mise or system python), you may need to reinstall the package. This can be done with:

Or you can reinstall all pipx packages with:

mise should do this automatically when using mise up python.

Other syntax may work but is unsupported and untested.

Set these with mise settings set [VARIABLE]=[VALUE] or by setting the environment variable listed.

URL to use for pipx registry.

This is used to fetch the latest version of a package from the pypi registry.

The default is https://pypi.org/pypi/{}/json which is the JSON endpoint for the pypi registry.

You can also use the HTML endpoint by setting this to https://pypi.org/simple/{}/.

If true, mise will use uvx instead of pipx if uv is installed and on PATH. This makes installing CLIs much faster by using uv as the package manager.

You can install it with mise:

The following tool-options are available for the pipx backend—these go in [tools] in mise.toml.

Set environment variables for uv tool install or pipx install. mise still sets the tool directory, bin directory, and configured Python package index variables after applying install_env.

Install additional components.

Additional arguments to pass to pipx when installing the package.

Set to false to always disable uv for this tool.

Additional arguments to pass to uvx when installing the package.

**Examples:**

Example 1 (unknown):
```unknown
mise use -g python
pip install --user pipx
```

Example 2 (unknown):
```unknown
$ mise use -g pipx:psf/black
$ black --version
black, 24.3.0
```

Example 3 (json):
```json
[tools]
"pipx:psf/black" = "latest"
```

Example 4 (unknown):
```unknown
mise install -f pipx:psf/black
```

---

## Cargo Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/cargo.html

**Contents:**
- Cargo Backend ​
- Dependencies ​
- Usage ​
  - Using Git ​
- Settings ​
  - cargo.binstall
  - cargo.binstall_only
  - cargo.registry_name
- Tool Options ​
  - install_env ​

You may install packages directly from Cargo Crates even if there isn't an asdf plugin for it.

The code for this is inside the mise repository at ./src/backend/cargo.rs.

This relies on having cargo installed. You can either install it on your system via rustup:

Or you can install it via mise:

The following installs the latest version of eza and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

You can install any package from a Git repository using the mise command. This allows you to install a particular tag, branch, or commit revision:

This will execute a cargo install command with the corresponding Git options.

Set these with mise settings set [VARIABLE]=[VALUE] or by setting the environment variable listed.

Some Cargo settings are only meaningful when mise runs cargo install. If cargo-binstall installs a prebuilt binary, Cargo build settings and cargo install behavior do not affect that artifact. Set cargo.binstall = false when you need Cargo settings to control the install.

When mise uses cargo-binstall, mise runs cargo-binstall once and lets cargo-binstall handle its own fallback order, including its final fallback to compiling with cargo install. mise does not retry with a separate cargo install command if cargo-binstall exits with an error.

If true, mise will use cargo binstall instead of cargo install if cargo-binstall is installed and on PATH. This makes installing CLIs with cargo much faster by downloading precompiled binaries.

When cargo-binstall installs a prebuilt binary, Cargo build settings and cargo install behavior do not affect the downloaded artifact. Set cargo.binstall = false to force cargo install when you need Cargo settings to control the install.

When mise invokes cargo-binstall, cargo-binstall handles its own fallback order, including its final fallback to compiling with cargo install. mise does not retry with a separate cargo install command if cargo-binstall exits with an error.

You can install it with mise:

Only use cargo-binstall for installation, fail if not available.

Packages are installed from the official cargo registry.

You can set this to a different registry name if you have a custom feed or want to use a different source.

Please follow the cargo alternative registries documentation to configure your registry.

The following tool-options are available for the cargo backend—these go in [tools] in mise.toml.

When cargo-binstall is available, mise uses it for registry installs unless a tool option needs cargo install to build from source.

For options that do not skip cargo-binstall, any source-build fallback is handled by cargo-binstall itself. mise does not perform an additional compile fallback after cargo-binstall fails.

Set environment variables for the cargo install or cargo-binstall command:

Install additional components (passed as cargo install --features):

This option requires cargo install; mise skips cargo-binstall when it is set.

Disable default features (passed as cargo install --no-default-features):

Setting this to false requires cargo install; mise skips cargo-binstall in that case.

Select the CLI bin name to install when multiple are available (passed as cargo install --bin):

This option is supported by cargo-binstall, so it does not cause mise to skip cargo-binstall.

Select the crate name to install when multiple are available (passed as cargo install --git=<repo> <crate>):

This option does not cause mise to skip cargo-binstall when applicable. Git installs already use cargo install.

Use Cargo.lock (passes cargo install --locked) when building CLI. This is the default behavior, pass false to disable:

This option does not cause mise to skip cargo-binstall; it only affects the install if cargo-binstall itself falls back to compiling with cargo install.

**Examples:**

Example 1 (sass):
```sass
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Example 2 (unknown):
```unknown
mise use -g rust
```

Example 3 (sass):
```sass
$ mise use -g cargo:eza
$ eza --version
eza - A modern, maintained replacement for ls
v0.17.1 [+git]
https://github.com/eza-community/eza
```

Example 4 (json):
```json
[tools]
"cargo:eza" = "latest"
```

---

## Ubi Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/ubi.html

**Contents:**
- Ubi Backend deprecated ​
- Usage ​
- Tool Options ​
  - exe ​
  - rename_exe ​
  - matching ​
  - matching_regex ​
  - provider ​
  - api_url ​
  - extract_all ​

The ubi backend is deprecated. Please use the GitHub backend instead.

The GitHub backend offers several advantages over ubi including provenance verification, download progress reports, and fewer dependencies. To migrate, replace ubi:owner/repo with github:owner/repo in your configuration files. The matching and matching_regex options carry over. One behavioral difference is worth noting: ubi applies the substring matching only as a tiebreaker among assets that already match your OS/arch, and skips it when a single asset matches the platform. The GitHub backend applies matching as a pre-filter before autodetection, so for multi-binary releases you get the binary your filter names, or a clear error naming the filter if it isn't published for your platform.

One migration gotcha: ubi folds matching into the install path, so you can install several binaries from one repo via separate matching values on the same ubi:owner/repo string. The GitHub backend keeps the install path keyed by tool name + version only, so two github:owner/repo entries with different matching values resolve to the same directory and the second overwrites the first. If you rely on that ubi pattern, give each binary its own tool_alias on GitHub so each gets its own install directory.

You may install GitHub Releases and URL packages directly using ubi backend. ubi is directly compiled into the mise codebase so it does not need to be installed separately to be used.

ubi doesn't require plugins or even any configuration for each tool. What it does is try to deduce what the proper binary/tarball is from GitHub releases and downloads the right one. As long as the vendor uses a somewhat standard labeling scheme for their releases, ubi should be able to figure it out.

The code for this is inside of the mise repository at ./src/backend/ubi.rs.

The following installs the latest version of goreleaser and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

The following tool-options are available for the ubi backend—these go in [tools] in mise.toml.

The exe option allows you to specify the executable name in the archive. This is useful when the archive contains multiple executables.

If you get an error like could not find any files named cli in the downloaded zip file, you can use the exe option to specify the executable name:

The rename_exe option allows you to specify the name of the executable once it has been extracted.

use the rename_exe option to specify the target executable name:

Set a string to match against the release filename when there are multiple files for your OS/arch, i.e. "gnu", "musl", or "msvc". Note that this is only used when there is more than one matching release filename for your OS/arch. If only one release asset matches your OS/arch, then this will be ignored.

Set a regular expression string that will be matched against release filenames before matching against OS/arch. If the pattern yields a single match, that release will be selected. If no matches are found, this will result in an error.

Set the provider type to use for fetching assets and release information. Either github or gitlab (default is github). Ensure the provider is set to the correct type if you use api_url as the type probably cannot be derived correctly from the URL.

Set the URL for the provider's API. This is useful when using a self-hosted instance.

Set to true to extract all files in the tarball instead of just the "bin". Not compatible with exe nor rename_exe.

The directory in the tarball where the binary(s) are located. This is useful when the binary is not in the root of the tarball. This only makes sense when extract_all is set to true.

Binary path lookup order:

Set a regex to filter out tags that don't match the regex. This is useful when a vendor has a bunch of releases for unrelated CLIs in the same repo. For example, cargo-bins/cargo-binstall has a bunch of releases for unrelated CLIs that are not cargo-binstall. This option can be used to filter out those releases.

If you are using a self-hosted GitHub/GitLab instance, you can set the provider and api_url tool options. Additionally, you can set the MISE_GITHUB_ENTERPRISE_TOKEN or MISE_GITLAB_ENTERPRISE_TOKEN environment variable to authenticate with the API.

Sometimes vendors use strange formats for their releases that ubi can't figure out, possibly for a specific os/arch combination. For example this recently happened in this ticket because a vendor used "mac" instead of the more common "macos" or "darwin" tags.

Try using ubi by itself to see if the issue is related to mise or ubi:

Another issue is that a GitHub release may have a bunch of tarballs, some that don't contain the CLI you want, you can use the matching field in order to specify a string to match against the release.

ubi assumes that the repo name is the same as the binary name, however that is often not the case. For example, BurntSushi/ripgrep gives us a binary named rg not ripgrep. In this case, you can specify the binary name with the exe field:

This issue is actually with mise and not with ubi. mise needs to be able to list the available versions of the tools so that "latest" points to whatever is the actual latest release of the CLI. What sometimes happens is vendors will have GitHub releases for unrelated things. For example, cargo-bins/cargo-binstall is the repo for cargo-binstall, however it has a bunch of releases for unrelated CLIs that are not cargo-binstall. We need to filter these out and that can be specified with the tag_regex tool option:

Now when running mise ls-remote ubi:cargo-bins/cargo-binstall[tag_regex=^\d+\.] you should only see versions starting with a number. Note that this command is cached so you likely will need to run mise cache clear first.

**Examples:**

Example 1 (unknown):
```unknown
$ mise use -g ubi:goreleaser/goreleaser
$ goreleaser --version
1.25.1
```

Example 2 (json):
```json
[tools]
"ubi:goreleaser/goreleaser" = "latest"
```

Example 3 (json):
```json
[tools]
"ubi:cli/cli" = { version = "latest", exe = "gh" } # github's cli
```

Example 4 (json):
```json
[tools]
"ubi:cli/cli" = { version = "latest", exe = "gh", rename_exe = "github" } # github's cli
```

---

## Aqua Backend | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/backends/aqua.html

**Contents:**
- Aqua Backend ​
- Custom Registry ​
- Usage ​
- Tool Options ​
  - symlink_bins ​
  - vars ​
  - prerelease ​
- Settings ​
  - aqua.baked_registry
  - aqua.cosign

Aqua tools may be used natively in mise. aqua is the ideal backend to use for new tools since they don't require plugins, they work on windows, they offer security features in addition to checksums. aqua installs also show more progress bars, which is nice.

You do not need to separately install aqua. The aqua CLI is not used in mise at all. What is used is the aqua registry that gets compiled into the mise binary on release. Here's an example package entry: aqua:hashicorp/terraform. mise has a reimplementation of aqua that knows how to work with these files to install tools.

As of this writing, aqua is relatively new to mise and because a lot of tools are being converted from asdf to aqua, there may be some configuration in aqua tools that need to be tightened up. I put some common issues below and would strongly recommend contributing changes back to the aqua registry if you notice problems. The maintainer is super responsive and great to work with.

If all else fails, you can disable aqua entirely with MISE_DISABLE_BACKENDS=aqua.

Currently aqua tools don't support setting environment variables or doing more than simply downloading binaries though (and I'm not sure this functionality would ever get added), so some tools will likely always require plugins like asdf/vfox.

The code for this is inside the mise repository at ./src/backend/aqua.rs.

Set aqua.registries to check custom aqua registry repositories before the baked-in registry:

To check multiple registries before the baked registry, list them in order:

mise downloads registry.yaml from each repository root, falling back to registry.yml if needed. Downloaded registry sources are cached under MISE_CACHE_DIR for aqua.registry_cache_ttl, which defaults to one week. In MISE_AQUA_REGISTRIES, separate multiple registry URLs with commas.

After a refreshed registry source is downloaded, mise hashes the source and uses that hash in the compiled registry cache path. When a new compiled cache is successfully loaded or written, older compiled caches for the same registry URL are pruned.

Packages are resolved by checking the configured registries in order. When aqua.baked_registry is enabled, the baked-in registry remains a fallback for packages missing from all configured registries. Aqua registry aliases are local to the registry that defines them; use [tool_alias] when you want a mise shorthand or alias to point at an aqua package from another registry.

The legacy aqua.registry_url setting is still supported for a single registry URL, but aqua.registries takes precedence when both are set.

The following installs the latest version of ripgrep and sets it as the active version on PATH:

The version will be set in ~/.config/mise/config.toml with the following format:

Some tools will default to use aqua if they're specified in registry/ to use the aqua backend. To see these tools, run mise registry | grep aqua:.

Some tools bundle extra executables that you may not want exposed on PATH. For example, aws-cli bundles Python, which can conflict with your intended Python version.

Setting symlink_bins = true creates a filtered .mise-bins directory and exposes only the binaries mise intends to expose for that Aqua package, instead of every discovered executable from the install.

Some aqua registry entries define template variables (for example {{.Vars.channel}}). Set them via tool options using either top-level keys or a nested vars table:

Vars with defaults are filled automatically. Vars marked as required in the aqua registry must be set unless the registry also provides a default.

By default, releases flagged prerelease: true on GitHub are excluded from mise ls-remote and from latest resolution. Set prerelease = true to include them:

When set, pre-release tags (e.g. v1.0.0-rc1, v0.1.2-dev.86) appear in mise ls-remote, latest resolves against the full list including pre-releases, and fuzzy version queries match pre-release tags. Has no effect when a package uses the github_tag version source (git tags don't carry a prerelease flag). Draft releases are always excluded. See the github backend docs for more detail.

Use baked-in aqua registry.

Use cosign to verify aqua tool signatures.

Extra arguments to pass to cosign when verifying aqua tool signatures.

Enable/disable GitHub Artifact Attestations verification for aqua tools. When enabled, mise will verify the authenticity and integrity of downloaded tools using GitHub's artifact attestation system.

Use minisign to verify aqua tool signatures.

Aqua registry repositories to fetch before the baked-in registry. mise downloads registry.yaml from each repository root and falls back to registry.yml if needed.

Downloaded registries are cached according to aqua.registry_cache_ttl, which defaults to one week. To refresh sooner, run mise cache clear, set aqua.registry_cache_ttl = "0s", or change MISE_CACHE_DIR to use a different cache location.

If this is set, mise checks the configured registries in order. When aqua.baked_registry is enabled, the baked-in aqua registry remains a fallback for packages missing from all configured registries.

By default, mise uses the baked-in official aqua registry when aqua.baked_registry is enabled. If the baked registry is disabled and no registries are configured, mise downloads the official registry: https://github.com/aquaproj/aqua-registry

How long downloaded aqua registry source files remain fresh before mise re-downloads them.

When the downloaded source changes, mise writes the new source cache atomically, compiles a new source-hash-scoped registry cache, and prunes older compiled caches for that registry URL after the new compiled cache is available.

Set to 0s to re-download remote registries every time.

Deprecated. Use aqua.registries instead.

Legacy single aqua registry repository URL to fetch before the baked-in registry.

Use SLSA to verify aqua tool signatures.

Aqua backend supports multiple security verification methods to ensure the integrity and authenticity of downloaded tools. mise provides native Rust implementation for all verification methods, eliminating the need for external CLI tools like cosign, slsa-verifier, or gh.

GitHub Artifact Attestations provide cryptographic proof that artifacts were built by specific GitHub Actions workflows. mise verifies these attestations natively to ensure the authenticity and integrity of downloaded tools.

Registry Configuration Example:

mise natively verifies Cosign signatures without requiring the cosign CLI tool to be installed.

mise natively verifies SLSA (Supply-chain Levels for Software Artifacts) provenance without requiring the slsa-verifier CLI tool.

During tool installation, mise will:

Example output during installation:

If verification fails:

To disable all verification temporarily:

Here's some common issues I've seen when working with aqua tools.

The aqua registry defines supported envs for each tool of the os/arch. I've noticed some of these are simply missing os/arch combos that are in fact supported—possibly because it was added after the registry was created for that tool.

The fix is simple, just edit the supported_envs section of registry.yaml for the tool in question.

This is a weird one that causes weird issues in mise. In general in mise we like versions like 1.2.3 with no decoration like v1.2.3 or cli-v1.2.3. This consistency not only makes mise.toml cleaner but, it also helps make things like mise up function right because it's able to parse it as semver without dealing with a bunch of edge-cases.

Really if you notice aqua tools are giving you versions that aren't simple triplets, it's worth fixing.

One common thing I've seen is registries using a version_filter expression like Version startsWith "Version startsWith "atlascli/"".

This ultimately causes the version to be atlascli/1.2.3 which is not what we want. The fix is to use version_prefix instead of version_filter and just put the prefix in the version_prefix field. In this example, it would be atlascli/. mise will automatically strip this out and add it back in, which it can't do with version_filter.

**Examples:**

Example 1 (json):
```json
[settings]
aqua.registries = ["https://github.com/my-org/aqua-registry"]
```

Example 2 (json):
```json
[settings]
aqua.registries = [
  "https://github.com/my-org/internal-aqua-registry",
  "https://github.com/partner/aqua-registry",
]
```

Example 3 (unknown):
```unknown
$ mise use -g aqua:BurntSushi/ripgrep
$ rg --version
ripgrep 14.1.1
```

Example 4 (json):
```json
[tools]
"aqua:BurntSushi/ripgrep" = "latest"
```

---

## Shims | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/shims.html

**Contents:**
- Shims ​
- Overview of the mise activation methods ​
  - PATH activation ​
  - Shims ​
- How to add mise shims to PATH ​
  - mise reshim ​
- Shims vs PATH ​
  - Env vars and shims ​
  - Hooks and shims ​
  - which ​

There are several ways for the mise context (dev tools, environment variables) to be loaded into your shell:

This page will help you understand the differences between these methods and how to use them. In particular, it will help you decide if you should use shims or mise activate in your shell.

Mise's "PATH" activation method updates environment variables every time the prompt is displayed. In particular, it updates the PATH environment variable, which is used by your shell to search for the programs it can run.

This is the method used when you add the echo 'eval "$(mise activate bash)"' >> ~/.bashrc line to your shell rc file (in this case, for bash).

For example, by default, your PATH variable might look like this:

If using mise activate, mise will automatically add the required tools to PATH.

In this example, the python bin directory was added at the beginning of the PATH, making it available in the current shell session. When a fuzzy version like python = "3.15" or node = "26" is active, this path may use the requested-version symlink, such as ~/.local/share/mise/installs/python/3.15/bin, instead of the fully resolved patch version.

While the PATH design of mise works great in most cases, there are some situations where shims are preferable. This is the case when you are not using an interactive shell (for example, when using mise in an IDE or a script).

mise activate --shims does not support all the features of mise activate. See shims vs path for more information.

When using shims, mise places small executables (shims) in a directory that is included in your PATH. You can think of shims as symlinks to the mise binary that intercept commands and load the appropriate context.

By default, the shim directory is located at ~/.local/share/mise/shims (on Windows: %LOCALAPPDATA%\mise\shims). When installing a tool (for example, node), mise will add some entries for every binary provided by this tool in the shims directory (for example, ~/.local/share/mise/shims/node).

To avoid calling ~/.local/share/mise/shims/node, you can add the shims directory to your PATH.

This will effectively make all dev tools available in your current shell session as well as non-interactive environments.

mise activate --shims is a shorthand for adding the shims directory to PATH.

The recommended way to add shims to PATH is to call mise activate --shims in one of your shell initialization file. For example, you can do the following:

In this example, we use mise activate --shims in the non-interactive shell configuration file (like .bash_profile or .zprofile) and mise activate in the interactive shell configuration file (like .bashrc or .zshrc)

mise activate will remove the shims directory from the PATH so it's fine to call mise activate --shims in your shell profile file then later call mise activate in an interactive session.

To force mise to update the content of the shims directory, you can manually call mise reshim.

Note that mise already runs a reshim anytime a tool is installed/updated/removed, so you don't need to use it for those scenarios. It is also done by default when using most tools such as npm.

mise reshim only creates/removes the shims. Some users sometimes use it as a "fix it" button, but it is only necessary if ~/.local/share/mise/shims doesn't contain something it should.

Do not add additional executable in the mise directory, mise will delete them with the next reshim.

The following features are affected when shims are used instead of PATH activation:

In general, using PATH (mise activate) instead of shims for interactive situations is recommended.

The way activate works is every time the prompt is displayed, mise-en-place will determine what PATH and other env vars should be and export them. This is why it doesn't work well for non-interactive situations like scripts. The prompt never gets displayed so you have to manually call mise hook-env to get mise to update the env vars. (though there are exceptions, see hook on cd)

A downside of shims is that the environment variables are only loaded when a shim is called. This means if you set an environment variable in mise.toml, it will only be used when a shim is called.

The following example only works under mise activate:

But this will work in either:

Also, mise x|exec and mise r|run can be used to get the environment even if you don't need any mise tools:

In general, tasks are a good way to ensure that the mise environment is always loaded.

The hooks cd, enter, exit, and watch_files only trigger with mise activate. However preinstall and postinstall still work with shims because they don't require shell integration.

which is a command that a lot of users find great value in. Using shims effectively "break" which and cause it to show the location of the shim. A workaround is to use mise which, which will show the actual location. Some users prefer the "cleanliness" of running which node and getting back a real path with a version number inside of it. e.g:

Truthfully, you're probably not going to notice a difference in performance when using shims vs. using mise activate.

If you are calling a shim from within a bash script like this:

You'll pay the mise penalty every time you call it within the loop. However, if you did the same thing but call a subprocess from within a shim (say, node creating a node subprocess), you will not pay a new penalty. This is because when a shim is called, mise sets up the environment with PATH for all tools and those PATH entries will be before the shim directory.

In other words, which is better in terms of performance just depends on how you're calling mise. Really though most users will not notice a few ms lag on their terminal caused by mise activate. See Troubleshooting: Slow shell prompts for how to diagnose performance issues.

The only difference between these would be that using hook-env you will need to call it again if you change directories but with shims that won't be necessary. The shims directory will be removed by mise activate automatically so you won't need to worry about dealing with shims in your PATH.

There are many ways to load the mise environment that don't require either, chiefly: mise x|exec, mise r|run or mise en.

These will both load all the tools and env vars before executing something. This might be ideal because you don't need to modify your shell rc file at all and the environment is always loaded explicitly. Some might find this is a "clean" way of working.

The obvious downside is that anytime one wants to use mise they need to prefix it with mise exec|run. Though, you can easily alias them to mx|mr.

For some shells (bash, zsh, fish, xonsh), mise hooks into the cd command, while in others, it only runs when the prompt is displayed. This relies on chpwd in zsh, PROMPT_COMMAND in bash, fish_prompt in fish, and on_chdir in xonsh.

The upside is that it doesn't run as frequently but since mise is written in Rust the cost for executing mise is negligible (a few ms).

If you run a set of commands in a single line like the following:

If using mise activate, in shell without hook on cd, this will use the tools from ~, not from ~/src/proj1 or ~/src/proj2 even after the directory changed.

This is because, in these shells mise runs just before your prompt gets displayed whereas in others, it hooks on cd. Note that shims will always work with the inline example above.

rc files like .zshrc are unusual. It's a script but also runs only for interactive sessions. If you need to access tools provided by mise inside of an rc file you have 2 options:

**Examples:**

Example 1 (bash):
```bash
echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

Example 2 (bash):
```bash
PATH="$HOME/.local/share/mise/installs/python/3.15.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
```

Example 3 (lua):
```lua
ls -l ~/.local/share/mise/shims/node
# [...] ~/.local/share/mise/shims/node -> ~/.local/bin/mise
```

Example 4 (elixir):
```elixir
mise use -g node@20
npm install -g prettier@3.1.0

~/.local/share/mise/shims/node -v
# v20.0.0
~/.local/share/mise/shims/prettier -v
# 3.1.0
```

---

## Dev Tools | mise-en-place

**URL:** https://mise.jdx.dev/dev-tools/index.html

**Contents:**
- Dev Tools ​
- How it works ​
  - Tool Resolution Flow ​
  - Environment Integration ​
  - Path Management ​
  - Configuration Hierarchy ​
- Tool Options ​
  - Table Format (Recommended) ​
  - Dotted Notation ​
  - Generic Nested Support ​

Install and switch between dev tools like node, python, cmake, terraform, and hundreds more, all from the same project config.

mise is a tool that manages installations of programming language runtimes and other tools for local development. For example, it can be used to manage multiple versions of Node.js, Python, Ruby, Go, etc. on the same machine.

Once activated, mise can automatically switch between different versions of tools based on the directory you're in. This means that if you have a project that requires Node.js 18 and another that requires Node.js 22, mise will automatically switch between them as you move between the two projects. See tools available for mise with in the registry.

To know which tool version to use, mise will typically look for a mise.toml file in the current directory and its parents. To get an idea of how tools are specified, here is an example of a mise.toml file:

It's also compatible with asdf .tool-versions files as well as idiomatic version files like .node-version and .ruby-version. See configuration for more details.

When specifying tool versions and tool options, you can also refer to environment variables or vars defined in your config hierarchy, including values produced by directives like _.source, _.file, or env modules. These are resolved before tool version and option templates are rendered.

mise is compatible with asdf .tool-versions files and can still use asdf plugins when needed. If you're migrating from asdf, see the comparison guide.

mise manages development tools through a sophisticated but user-friendly system that automatically handles tool installation, version management, and environment setup.

When you enter a directory or run a command, mise follows this process:

mise provides several ways to integrate with your development environment:

Automatic Activation: With mise activate, mise hooks into your shell prompt and automatically updates your environment when you change directories:

On-Demand Execution: Use mise exec to run commands with mise's environment without permanent activation:

Shims: mise can create lightweight wrapper scripts that automatically use the correct tool versions:

mise modifies your PATH environment variable to prioritize the correct tool versions:

This ensures that when you run node, you get the version specified in your project configuration, not a system-wide installation.

mise supports nested configuration that cascades from broad to specific settings:

Each level can override or extend the previous ones, giving you fine-grained control over tool versions across different contexts.

Tool options allow you to customize how tools are installed and configured. They support nested configurations for better organization, particularly useful for platform-specific settings.

The cleanest way to specify nested options is using TOML tables:

You can also use dotted notation for simpler nested configurations:

Any backend can use nested options for organizing complex configurations:

Internally, nested options are flattened to dot notation (e.g., platforms.macos-x64.url, database.host, cache.redis.port) for backend access.

Run a command immediately after a tool finishes installing by adding a postinstall field to that tool's configuration. This is separate from [hooks].postinstall and applies only to when a specific tool is installed.

You can restrict tools to specific operating systems using the os field:

The os field accepts an array of operating system identifiers:

You can also restrict tools to specific OS and architecture combinations using the os/arch syntax:

Supported architecture identifiers:

When an entry contains /, both the OS and architecture must match. When an entry is just an OS name, it matches any architecture on that OS.

If a tool specifies an os restriction and the current operating system is not in the list, mise will skip installing and using that tool.

You can declare explicit installation dependencies between tools using the depends field. This ensures that one tool is fully installed before another begins installing.

In this example, pipx:ruff will wait for python to finish installing before it starts.

The depends field accepts either a single string or an array of strings:

User-specified depends adds ordering constraints for tools already in the current install set. Use it when one configured tool install must finish before another configured tool install starts, especially when installs would otherwise run in parallel.

depends in [tools] only adds install graph ordering. It does not by itself declare hook-time dependencies or add those tools to the PATH used while vfox install hooks run.

For vfox plugins, declare install-hook tool requirements on the PLUGIN table in metadata.lua:

Use tool names as they would appear in mise.toml. When matching tools are configured, mise uses those metadata entries to order current install jobs and to build the hook environment. See Tool plugin development.

mise uses intelligent caching to minimize overhead:

This ensures that mise adds minimal latency to your daily development workflow.

After activating, mise will update env vars like PATH whenever the directory is changed or the prompt is displayed. See the FAQ.

After activating, every time your prompt displays it will call mise hook-env to fetch new environment variables. This should be very fast. It exits early if the directory wasn't changed or mise.toml/.tool-versions files haven't been modified.

mise modifies PATH ahead of time so the runtimes are called directly. This means that calling a tool has zero overhead and commands like which node returns the real path to the binary. Other tools like asdf only support shim files to dynamically locate runtimes when they're called which adds a small delay and can cause issues with some commands. See shims for more information.

Here are some of the most important commands when it comes to working with dev tools. Click the header for each command to go to its reference documentation page to see all available flags/options and more examples.

For some users, mise use might be the only command you need to learn. It will do the following:

mise use node@26 will install the latest version of node-26 and create/update the mise.toml config file in the local directory. The resulting file looks like this:

Anytime you're in that directory, that version of node will be used.

mise use -g node@26 will do the same but update the global config (~/.config/mise/config.toml) so unless there is a config file in the local directory hierarchy, node-26 will be the default version for the user.

You can also edit mise.toml directly instead of using mise use — the effect is the same. Run mise install after editing to install any new tools.

mise install will install but not activate tools—meaning it will download/build/compile the tool into ~/.local/share/mise/installs but you won't be able to use it without "setting" the version in a .mise-toml or .tool-versions file.

If you're coming from asdf, there is no need to also run mise plugin add to first install the plugin, that will be done automatically if needed. Of course, you can manually install plugins if you wish or you want to use a plugin not in the default registry.

There are many ways it can be used:

mise x can be used for one-off commands using specific tools. e.g.: if you want to run a script with python3.12:

Python will be installed if it is not already. mise x will read local/global .mise-toml/.tool-versions files as well, so if you don't want to use mise activate or shims you can use mise by just prefixing commands with mise x --:

If you use this a lot, an alias can be helpful:

Similarly, mise run can be used to execute tasks which will also activate the mise environment with all of your tools.

mise provides several mechanisms to automatically install missing tools or versions as needed. Below, these are grouped by how and when they are triggered, with relevant settings for each. All mechanisms require the global auto_install setting to be enabled (all auto_install settings are enabled by default).

When you run a command like mise x or mise r, mise will automatically install any missing tool versions required to execute the command.

If you type a command in your shell (e.g., node) and it is not found, mise can attempt to auto-install the missing tool version if it knows which tool provides that binary.

Disable auto_install for specific tools by setting auto_install_disable_tools to a list of tool names.

**Examples:**

Example 1 (json):
```json
[tools]
node = '24'
python = '3'
ruby = 'latest'
```

Example 2 (unknown):
```unknown
eval "$(mise activate zsh)"  # In your ~/.zshrc
cd my-project               # Automatically loads mise.toml tools
```

Example 3 (sql):
```sql
mise exec -- node my-script.js  # Runs with tools from mise.toml
```

Example 4 (unknown):
```unknown
mise activate --shims  # Creates shims instead of modifying PATH
```

---
