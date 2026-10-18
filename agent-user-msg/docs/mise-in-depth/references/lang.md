# Mise - Lang

**Pages:** 13

---

## Ruby | mise-en-place

**URL:** https://mise.jdx.dev/lang/ruby.html

**Contents:**
- Ruby ​
- Usage ​
- Precompiled Binaries ​
  - Precompiled build revisions ​
- Default gems ​
- Tool Options ​
  - install_env ​
- .ruby-version and Gemfile support ​
- Manually updating ruby-build ​
- Settings ​

Like rvm, rbenv, or asdf, mise can manage multiple versions of Ruby on the same system.

The following are instructions for using the ruby mise core plugin. This is used when there isn't a git plugin installed named "ruby". If you want to use asdf-ruby then use mise plugins install ruby GIT_URL.

The code for this is inside the mise repository at ./src/plugins/core/ruby.rs.

The following installs the latest version of ruby-3.2.x (if some version of 3.2.x is not already installed) and makes it the global default:

Behind the scenes, mise uses ruby-build to compile ruby from source. Ensure that you have the necessary dependencies installed. You can check its README for additional settings and some troubleshooting.

Mise can download precompiled Ruby binaries instead of compiling from source. This significantly reduces installation time.

Precompiled binaries will become the default in 2026.8.0. To opt in now:

Precompiled binaries are sourced from jdx/ruby and are available for the following platforms:

If a precompiled binary is not available for your platform or Ruby version, mise automatically falls back to compiling from source using ruby-build.

Precompiled Ruby binaries are released from jdx/ruby. Sometimes the binary for a Ruby version is rebuilt without changing the Ruby version itself. Those rebuilds use build revision release tags like 3.3.11-1 or 3.3.11-2. Mise uses these build revision tags for jdx/ruby precompiled binaries instead of the floating base release tag.

Rebuilds are for changes to the portable binary package, not changes to Ruby's own version number. The jdx/ruby release history includes rebuilds for reasons such as:

This list is not exhaustive.

Mise still treats the Ruby version as 3.3.11. Without a mise.lock, mise uses the latest available precompiled build revision when resolving the install. That means reinstalling the same Ruby version later may pick up a newer rebuild if one was published.

With a mise.lock, the download URL records which precompiled build revision is used:

To see which precompiled build revision you have, inspect the release tag in the platform url:

If the lockfile already points at a build revision such as 3.3.11-1, mise keeps using that exact revision for reproducibility. To update to the newest precompiled build revision for the same Ruby version, remove the entire Ruby entry from mise.lock or remove every Ruby platform url, then regenerate the lock entry and reinstall:

Commit the updated mise.lock so other machines and CI use the same precompiled build revision.

To always compile from source even when precompiled binaries are available:

You can also use a custom source for precompiled binaries by setting ruby.precompiled_url to either a GitHub repo (e.g., owner/repo) or a full URL template.

You can also install a specific ruby flavour. To get the latest version from a flavour, just use the flavour prefix.

Default package files are deprecated. They are still supported for now, but mise will start warning in 2026.11.0 and support will be removed in 2027.11.0.

For Ruby CLIs, install the tool directly with the gem backend:

For gems that really should be installed into every Ruby version, use a tool-level postinstall hook:

mise can automatically install a default set of gems right after installing a new ruby version. To use this legacy feature, provide a $HOME/.default-gems file that lists one gem per line, for example:

The following tool-options are available for the ruby backend. These options go in the [tools] section in mise.toml.

Set environment variables for ruby-build or ruby-install and default gem installation:

mise uses a mise.toml or .tool-versions file for auto-switching between software versions. However, it can also read ruby-specific version files .ruby-version or Gemfile (if it specifies a ruby version).

Create a .ruby-version file for the current version of ruby:

Enable idiomatic version file reading for ruby:

See idiomatic version files for more information.

ruby-build should update daily, however if you find versions do not yet exist you can force an update:

ruby-build already has a handful of settings, in additional to that mise has a few extra settings:

A list of patch files or URLs to apply to ruby source.

Controls whether Ruby is compiled from source or downloaded as precompiled binaries.

Path to a file containing default ruby gems to install when installing ruby.

Override the global github_attestations setting for Ruby precompiled binaries. When enabled, mise will verify the authenticity of precompiled Ruby binaries from jdx/ruby.

Defaults to the global github_attestations setting if not specified.

Override architecture identifier for precompiled Ruby binaries.

Override OS identifier for precompiled Ruby binaries.

Options to pass to ruby-build.

The URL used to fetch ruby-build. This accepts either a Git repository or a ZIP archive.

Use ruby-install instead of ruby-build.

Options to pass to ruby-install.

The URL used to fetch ruby-install. This accepts either a Git repository or a ZIP archive.

Set to true to enable verbose output during ruby installation.

**Examples:**

Example 1 (elixir):
```elixir
mise use -g ruby@3.2
```

Example 2 (elixir):
```elixir
mise settings ruby.compile=false
mise use ruby@3.4.1
```

Example 3 (json):
```json
[[tools.ruby]]
version = "3.3.11"

[tools.ruby.platforms.linux-x64]
url = "https://github.com/jdx/ruby/releases/download/3.3.11-1/ruby-3.3.11.x86_64_linux.tar.gz"
```

Example 4 (unknown):
```unknown
mise lock ruby
mise install --force ruby
```

---

## Node | mise-en-place

**URL:** https://mise.jdx.dev/lang/node.html

**Contents:**
- Node ​
- Usage ​
- Tool Options ​
  - install_env ​
- Pinning npm version ​
- .nvmrc, .node-version and package.json support ​
- Default node packages ​
- "nodejs" -> "node" Alias ​
- Building from source ​
- Unofficial Builds ​

Like nvm, (or volta, fnm or asdf...), mise can manage multiple versions of Node.js on the same system.

The following are instructions for using the node mise core plugin. This is used when there isn't a git plugin installed named "node". If you want to use asdf-nodejs then run mise plugins install node https://github.com/asdf-vm/asdf-nodejs

The code for this is inside the mise repository at ./src/plugins/core/node.rs.

The following installs the latest version of node-26.x and makes it the global default:

See the Node.JS Cookbook for common tasks and examples.

The following tool-options are available for the node backend. These options go in the [tools] section in mise.toml.

Set environment variables for source builds, default package installation, Corepack setup, and install-time verification commands run by the core node backend:

By default, Node.js ships with a bundled version of npm. If you need a specific npm version (e.g. to keep your entire team on the same version and avoid package-lock.json conflicts), you can pin it alongside Node in your mise.toml:

To pin both to exact versions:

This resolves aliases like lts and latest to exact version numbers in mise.toml, e.g.:

The pinned npm version takes precedence over the one bundled with Node, so npm --version will always return the version specified in mise.toml.

By default, mise uses a mise.toml file for auto-switching between software versions.

It also supports .tool-versions file to specify versions for ASDF compatibility. Additionally, .nvmrc, .node-version, and the devEngines field in package.json are supported but require explicit enabling (see tip below).

This makes it a drop-in replacement for nvm. See idiomatic version files for more information.

Idiomatic version files (.nvmrc, .node-version, devEngines field in package.json) are disabled by default and must be explicitly enabled:

Or in ~/.config/mise/config.toml:

Default package files are deprecated. They are still supported for now, but mise will start warning in 2026.11.0 and support will be removed in 2027.11.0.

For npm CLIs, install the tool directly with the npm backend:

For packages that really should be installed into every Node.js version, use a tool-level postinstall hook:

mise-node can automatically install a default set of npm packages right after installing a node version. To use this legacy feature, provide a $HOME/.default-npm-packages file that lists one package per line, for example:

You can specify a non-default location of this file by setting a MISE_NODE_DEFAULT_PACKAGES_FILE variable.

You cannot install/use a plugin named "nodejs". If you attempt this, mise will just rename it to "node". See the FAQ for an explanation.

If compiling from source, see BUILDING.md in node's documentation for required system dependencies.

Nodejs.org offers a set of unofficial builds which are compatible with some platforms that are not supported by the official binaries. These are a nice alternative to compiling from source for these platforms.

To use, first set the mirror url to point to the unofficial builds:

If your goal is to simply support an alternative arch/os like linux-loong64 or linux-armv6l, this is all that is required. Node also provides flavors such as musl or glibc-217 (an older glibc version than what the official binaries are built with).

To use these, set node.flavor:

For the common musl case, mise settings libc=musl also selects Node's musl flavor when node.flavor is unset.

Additional CFLAGS options (e.g., to override -O3).

Compile node from source.

Number of parallel jobs for node compilation. Defaults to the number of physical CPU cores when using make. When ninja is enabled, this defaults to unset (ninja handles concurrency automatically).

Additional ./configure options.

Installs the default corepack shims after installing any node version.

Path to a file containing packages to install with npm after installing a new Node.js version. Defaults to ~/.default-npm-packages. Also checks ~/.default-nodejs-packages and ~/.default-node-packages for backwards compatibility.

Format: one package per line, with optional version specifier:

Install a specific node flavor like glibc-217 or musl. Use with unofficial node build repo.

Use gpg to verify node tool signatures.

Additional make install options.

Additional make options.

Mirror to download node tarballs from.

If true, use ninja build system instead of make for faster compilation. Defaults to true if ninja is found on PATH, false otherwise.

Ninja is generally faster than make for incremental builds.

Directory for nodenv.

Install a bash wrapper at bin/npm that triggers mise reshim after npm install -g. Disable to let corepack or a global npm install -g npm@... manage bin/npm directly.

Verify the downloaded assets using GPG.

**Examples:**

Example 1 (elixir):
```elixir
mise use -g node@26
```

Example 2 (json):
```json
[tools]
node = { version = "latest", install_env = { CFLAGS = "-O2" } }
```

Example 3 (json):
```json
[tools]
node = "26"
npm = "11"
```

Example 4 (elixir):
```elixir
mise use --pin node@lts npm@latest
```

---

## Deno | mise-en-place

**URL:** https://mise.jdx.dev/lang/deno.html

**Contents:**
- Deno ​
- Usage ​
- Tool Options ​
  - install_env ​

mise can be used to install and manage multiple versions of deno on the same system.

The following are instructions for using the deno mise core plugin. This is used when there isn't a git plugin installed named "deno". If you want to use asdf-deno then run mise plugins install deno https://github.com/asdf-community/asdf-deno.

The code for this is inside the mise repository at ./src/plugins/core/deno.rs.

The following installs deno and makes it the global default:

See available versions with mise ls-remote deno.

Avoid using deno upgrade to upgrade deno as mise will not be aware of the change.

The following tool-options are available for the deno backend. These options go in the [tools] section in mise.toml.

Set environment variables for install-time commands run by the core deno backend:

**Examples:**

Example 1 (elixir):
```elixir
mise use -g deno@1       # install deno 1.x
mise use -g deno@latest  # install latest deno
```

Example 2 (json):
```json
[tools]
deno = { version = "latest", install_env = { HTTPS_PROXY = "http://proxy.example" } }
```

---

## Elixir | mise-en-place

**URL:** https://mise.jdx.dev/lang/elixir.html

**Contents:**
- Elixir ​
- Usage ​
- Tool Options ​
  - install_env ​

mise can be used to manage multiple elixir versions on the same system.

The following are instructions for using the elixir core plugin. This is used when there isn't a git plugin installed named "elixir".

The code for this is inside the mise repository at ./src/plugins/core/elixir.rs.

Use the latest stable version of elixir:

Note that erlang is required to install elixir.

The following tool-options are available for the elixir backend. These options go in the [tools] section in mise.toml.

Set environment variables for install-time commands run by the core elixir backend:

**Examples:**

Example 1 (unknown):
```unknown
mise use -g erlang elixir
```

Example 2 (json):
```json
[tools]
elixir = { version = "latest", install_env = { MIX_HOME = "~/.mix" } }
```

---

## Swift | mise-en-place

**URL:** https://mise.jdx.dev/lang/swift.html

**Contents:**
- Swift ​
- Usage ​
- Tool Options ​
  - install_env ​
- Settings ​
  - swift.gpg_verify
  - swift.platform

mise can be used to manage multiple versions of swift on the same system. Swift is supported for macos and linux.

Use the latest stable version of swift:

See a mise guide for Swift developers on how to use mise with swift.

The following tool-options are available for the swift backend. These options go in the [tools] section in mise.toml.

Set environment variables for install-time commands run by the core swift backend:

Use gpg to verify swift tool signatures.

Override the platform to use for precompiled binaries.

**Examples:**

Example 1 (unknown):
```unknown
mise use -g swift
swift --version
```

Example 2 (json):
```json
[tools]
swift = { version = "latest", install_env = { HTTPS_PROXY = "http://proxy.example" } }
```

---

## Java | mise-en-place

**URL:** https://mise.jdx.dev/lang/java.html

**Contents:**
- Java ​
- Usage ​
- JAVA_HOME ​
- macOS JAVA_HOME Integration ​
- .java-version and .sdkmanrc files support ​
  - Using unsupported versions ​
- Tool Options ​
  - install_env ​
  - release_type ​
- Gradle toolchains detection ​

Like sdkman, mise can manage multiple versions of Java on the same system.

The following are instructions for using the java mise core plugin. This is used when there isn't a git plugin installed named "java". If you want to use asdf-java then use mise plugins install java GIT_URL.

The code for this is inside the mise repository at ./src/plugins/core/java.rs.

The following installs the latest version of openjdk-21.x (if some version of openjdk-21.x is not already installed) and makes it the global default:

You can also install a jdk from a different vendor. To get the latest version from a vendor just use the vendor prefix.

See available versions with mise ls-remote java.

Note that shorthand versions (like 21 in the example) use OpenJDK as the default vendor. The default vendor can be changed with the setting java.shorthand_vendor. The OpenJDK versions will only be updated for a 6-month period. Updates and security patches will not be available after this short period. This also applies for LTS versions.

For more information on which JDK to choose, see https://whichjdk.com.

mise automatically sets JAVA_HOME to the active Java installation. This requires mise activate — shims alone do not set environment variables like JAVA_HOME.

If JAVA_HOME appears stuck on an old version after changing your mise.toml, try:

If using an IDE that reads JAVA_HOME at startup, you may need to restart it after switching Java versions. For non-interactive environments (CI, scripts), use mise exec or mise run which always set up the full environment.

Some applications in macOS rely on /usr/libexec/java_home to find installed Java runtimes.

To integrate an installed Java runtime with macOS run the following commands for the proper version (e.g. openjdk-21).

Note: Not all distributions of the Java SDK support this integration (e.g liberica).

The Java core plugin supports the idiomatic version files .java-version and .sdkmanrc. See idiomatic version files.

For .sdkmanrc files, mise will try to map the vendor and version to the appropriate version string. For example, the version 20.0.2-tem will be mapped to temurin-20.0.2. Due to Azul's Zulu versioning, the version 11.0.12-zulu will be mapped to the major version zulu-11.

Not all vendors available in sdkman are supported by mise. The following vendors are NOT supported: bsg (Bisheng), graal (GraalVM), nik (Liberica NIK).

In case an unsupported version of java is needed, some manual work is required:

The following tool-options are available for the java backend. These options go in the [tools] section in mise.toml.

Set environment variables for install-time commands run by the core java backend:

The release_type option allows you to specify the type of release to install. The following values are supported:

Gradle can automatically detect toolchains installed by some tools (see toolchain | auto-detection).

At the moment, Gradle does not support auto-detecting Java installations by mise (see gradle/issues/29508 and gradle/issues/29355). A workaround is to leverage the fact that mise install layout is similar to the one used by asdf.

Otherwise, you can always use the foojay-resolver-convention plugin to let Gradle automatically install JDKs required by your project.

Shorthand for Java. Used when installing Java without a vendor prefix.

**Examples:**

Example 1 (elixir):
```elixir
mise use -g java@openjdk-21
mise use -g java@21         # alternate shorthands for openjdk
```

Example 2 (sql):
```sql
mise use -g java@temurin        # latest version from Temurin
mise use -g java@temurin-21
mise use -g java@zulu-21
mise use -g java@corretto-21
```

Example 3 (bash):
```bash
cd . # triggers mise hook-env to re-evaluate
echo $JAVA_HOME
```

Example 4 (unknown):
```unknown
sudo mkdir /Library/Java/JavaVirtualMachines/openjdk-21.jdk
sudo ln -s ~/.local/share/mise/installs/java/openjdk-21/Contents /Library/Java/JavaVirtualMachines/openjdk-21.jdk/Contents
```

---

## .NET | mise-en-place

**URL:** https://mise.jdx.dev/lang/dotnet.html

**Contents:**
- .NET ​
- Usage ​
- global.json support ​
- Isolated Mode ​
- Runtime-only Installs ​
  - Valid runtime values ​
  - Example: mix SDK and runtime ​
- Tool Options ​
  - install_env ​
- Environment Variables ​

The core .NET plugin installs .NET SDKs using Microsoft's official install script. All SDK versions are installed side-by-side under a shared DOTNET_ROOT directory, matching .NET's native multi-version model. This means dotnet --list-sdks will see every version you've installed through mise.

Unlike most tools, the SDKs don't live inside ~/.local/share/mise/installs because they share a common root. mise symlinks the install path to DOTNET_ROOT and sets environment variables so the correct SDK is picked up.

This plugin manages the .NET SDK itself. To install .NET global tools (e.g., dotnet-ef), use the dotnet backend with dotnet:ToolName syntax.

Use the latest .NET SDK:

Use a specific version:

Install multiple SDKs side-by-side for multi-targeting:

mise recognizes global.json as an idiomatic version file. If your project contains a global.json with an SDK version, mise will automatically use it:

Enable idiomatic version file support:

By default, all SDK versions share a single DOTNET_ROOT directory. This matches .NET's native side-by-side model and means dotnet --list-sdks shows every installed version.

If you prefer the traditional mise approach where each version gets its own directory, enable isolated mode:

In isolated mode each SDK version is installed under ~/.local/share/mise/installs/dotnet/<version>/, just like most other mise-managed tools. dotnet --list-sdks will only report the currently active version.

By default, mise installs the full .NET SDK. If you only need to run .NET applications without building them and without the added overhead of the SDK, you can install just the runtime using the runtime inline option:

You can install a full SDK for development alongside a runtime for a production-like environment:

Only exact runtime versions are supported (e.g., dotnet[runtime=dotnet]@8.0.14). Channel syntax like @8 is not currently supported for runtime installs, as it resolves against SDK versions rather than runtime versions.

The following tool-options are available for the dotnet backend. These options go in the [tools] section in mise.toml.

Set environment variables for the .NET install script and install-time verification commands:

The plugin sets the following environment variables:

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

**Examples:**

Example 1 (elixir):
```elixir
mise use -g dotnet@latest
dotnet --version
```

Example 2 (elixir):
```elixir
mise use -g dotnet@8.0.400
dotnet --version
```

Example 3 (elixir):
```elixir
mise use dotnet@8
mise use dotnet@9
dotnet --list-sdks
```

Example 4 (json):
```json
{
  "sdk": {
    "version": "8.0.100"
  }
}
```

---

## Python | mise-en-place

**URL:** https://mise.jdx.dev/lang/python.html

**Contents:**
- Python ​
- Usage ​
- Tool Options ​
  - install_env ​
  - patch_sysconfig ​
- .python-version support ​
- Automatic virtualenv activation ​
  - _.python.venv configuration ​
  - python.uv_venv_auto setting ​
- mise & uv ​

Like pyenv, mise can manage multiple versions of Python on the same system. Mise can also automatically create virtual environments for your projects and integrates with uv.

The following are instructions for using the python mise core plugin. The core plugin will be used so long as no plugin is manually installed named "python" using mise plugins install python [GIT_URL].

The code for this is inside of the mise repository at ./src/plugins/core/python.rs.

The following installs the latest version of python-3.15.x and makes it the global default:

You can also use multiple versions of python at the same time:

You can also install a specific python flavour. To get the latest version from a flavour just use the flavour prefix.

See the Python Cookbook for common tasks and examples.

The following tool-options are available for the python backend. These options go in the [tools] section in mise.toml.

Set environment variables for python-build, default package installation, and install-time verification commands run by the core python backend:

When installing precompiled Python binaries on Unix, mise patches the Python sysconfig data by default so build-time paths from python-build-standalone point at the final mise install path. If that patching causes an install problem for a specific Python build, disable it with patch_sysconfig = false:

Disabling this patch can leave stale build-time paths in the installed Python's sysconfig data, so prefer the default unless you need this as an install workaround.

.python-version/.python-versions files are supported by mise. See idiomatic version files.

mise has two ways to manage Python virtualenvs:

python.uv_venv_auto detects and sources the .venv managed by uv. Use "source" to only activate existing venvs, or "create|source" to create if missing. See the mise + uv Cookbook for full examples.

_.python.venv creates/activates a venv and adds it to PATH. It works with both mise activate and mise exec. Use this for projects that don't use uv.

These are separate mechanisms with different code paths. Options like uv_create_args and python_create_args in _.python.venv are not used by python.uv_venv_auto.

Use _.python.venv in the [env] section of mise.toml:

The venv will need to be created manually with python -m venv /path/to/venv unless create=true. See env-directives for _.python.venv.

Virtualenv activation requires mise activate or mise exec. When using shims alone, the venv's bin/ directory is not added to PATH, so which python will point to the shim rather than the venv's interpreter.

For uv-managed projects (those with a uv.lock file), you can use the python.uv_venv_auto setting to automatically source or create the .venv that uv manages. See the mise + uv Cookbook for full examples.

If you have installed uv (for example, with mise use -g uv@latest), mise will use it to create virtual environments via _.python.venv. Otherwise, it will use the built-in python -m venv command.

Note that uv does not include pip by default (as uv provides uv pip instead). If you need the pip package, add the uv_create_args = ['--seed'] option.

The true value for python.uv_venv_auto is considered legacy and will be deprecated in a future release (planned for mise 2026.7). Prefer "source" or "create|source" instead. Note: the python.uv_venv_auto setting itself is not going away — only the true value is being phased out.

One difference between the legacy true value and the newer string values is that true also exports UV_PYTHON (set to just the Python version number). This tells uv which Python version to use, but does not guarantee that uv uses the specific interpreter managed by mise — uv may fall back to a system or self-managed Python of the same version.

To strictly ensure uv uses mise's managed Python interpreter, set UV_PYTHON to the actual install path instead:

See the mise + uv Cookbook for more examples.

Default package files are deprecated. They are still supported for now, but mise will start warning in 2026.11.0 and support will be removed in 2027.11.0.

For Python CLIs, install the tool directly with the pipx backend:

For packages that really should be installed into every Python version, use a tool-level postinstall hook:

mise can automatically install a default set of Python packages with pip right after installing a Python version. To use this legacy feature, provide a $HOME/.default-python-packages file that lists one package per line, for example:

You can specify a non-default location of this file by setting a MISE_PYTHON_DEFAULT_PACKAGES_FILE variable.

By default, mise will download precompiled binaries for python instead of compiling them with python-build. This makes installing python much faster.

In addition to being faster, it also means you don't have to install all of the system dependencies either.

That said, there are some quirks with the precompiled binaries to be aware of.

If you'd like to disable these binaries, set mise settings python.compile=1.

These binaries may not work on older CPUs however you may opt into binaries which are more compatible with older CPUs by setting MISE_PYTHON_PRECOMPILED_ARCH with a different version. See https://gregoryszorc.com/docs/python-build-standalone/main/running.html for more information on this option. Set it to "x86_64" for the most compatible binaries.

Optionally, mise uses python-build (part of pyenv) to compile python runtimes, you need to ensure its dependencies are installed before installing python with python-build.

Free-threaded python can be installed via python-build by running the following:

Or to compile with python-build:

If you normally use Homebrew and you see errors regarding OpenSSL, your best bet might be using the following command to install Python:

Homebrew installs its own OpenSSL version, which may collide with system-expected ones. You could even add that to your .profile, .bashrc, .zshrc... to avoid setting them every time

Additionally, if you encounter issues with python-build, you may benefit from unlinking pkg-config prior to install (reason).

Thus the entire script would look like:

python-build already has a handful of settings, in additional to that python in mise has a few extra configuration variables.

Set these with mise settings set [VARIABLE]=[VALUE] or by setting the environment variable.

Path to a file containing default python packages to install when installing a python version.

Override the global github_attestations setting for Python precompiled binaries. When enabled, mise will verify the authenticity of precompiled Python binaries from astral-sh/python-build-standalone.

Defaults to the global github_attestations setting if not specified.

URL to fetch python patches from to pass to python-build.

Directory to fetch python patches from.

Specify the architecture to use for precompiled binaries. If on an old CPU, you may want to set this to "x86_64" for the most compatible binaries. See https://gregoryszorc.com/docs/python-build-standalone/main/running.html for more information.

Specify the flavor to use for precompiled binaries.

Options are available here: https://gregoryszorc.com/docs/python-build-standalone/main/running.html

Specify the OS to use for precompiled binaries.

URL to fetch pyenv from for compiling python with python-build.

Controls how mise handles uv project venvs when a uv.lock file is present.

The legacy true value (will be deprecated in a future release) is treated like "create|source", with one difference: When using this, mise also exports UV_PYTHON to force uv to use the python version managed by mise.

Arguments to pass to uv when creating a venv.

Arguments to pass to python when creating a venv. (not used for uv venv creation)

Prefer to use venv from Python's standard library.

**Examples:**

Example 1 (elixir):
```elixir
mise use -g python@3.15
```

Example 2 (elixir):
```elixir
$ mise use -g python@3.14 python@3.15
$ python -V
3.14.0
$ python3.15 -V
3.15.0
```

Example 3 (elixir):
```elixir
mise use -g python@anaconda         # latest version of anaconda
```

Example 4 (json):
```json
[tools]
python = { version = "latest", install_env = { CONFIGURE_OPTS = "--enable-optimizations" } }
```

---

## Erlang | mise-en-place

**URL:** https://mise.jdx.dev/lang/erlang.html

**Contents:**
- Erlang ​
- Usage ​
- kerl ​
- Tool Options ​
  - install_env ​
- Settings ​
  - erlang.compile

mise can be used to install and manage multiple versions of erlang on the same system.

The following are instructions for using the erlang core plugin. This is used when there isn't a git plugin installed named "erlang".

The code for this is inside the mise repository at ./src/plugins/core/erlang.rs.

The following installs erlang and makes it the global default:

See available versions with mise ls-remote erlang.

The plugin uses kerl under the hood to build erlang. See kerl's docs for information on configuring kerl.

On GitHub Actions Linux runners, ImageOS=ubuntu24, ImageOS=ubuntu22, and ImageOS=ubuntu20 map to the precompiled Erlang build targets ubuntu-24.04, ubuntu-22.04, and ubuntu-20.04. Unsupported values disable precompiled lockfile URL resolution in the default erlang.compile mode, so locked installs can fall back to kerl.

The following tool-options are available for the erlang backend. These options go in the [tools] section in mise.toml.

Set environment variables for kerl build/install commands and other install-time commands run by the core erlang backend:

If true, compile erlang from source. If false, use precompiled binaries. If not set, use precompiled binaries if available.

**Examples:**

Example 1 (elixir):
```elixir
mise use -g erlang@26
```

Example 2 (json):
```json
[tools]
erlang = { version = "latest", install_env = { KERL_CONFIGURE_OPTIONS = "--without-javac" } }
```

---

## Zig | mise-en-place

**URL:** https://mise.jdx.dev/lang/zig.html

**Contents:**
- Zig ​
- Usage ​
  - master (nightly channel) ​
- zig Language Server ​
- Tool Options ​
  - install_env ​
- Settings ​
  - zig.use_community_mirrors

mise can be used to install and manage multiple versions of zig on the same system.

The following are instructions for using the zig mise core plugin.

The code for this is inside the mise repository at ./src/plugins/core/zig.rs.

The following installs zig and makes it the global default:

See available stable versions with mise ls-remote zig.

Note that Mach versions won't show in mise ls-remote zig due to workaround for version ordering bug. Despite of that, you still can install Mach versions listed in Mach version index. The following command will list available Mach versions:

zig@master tracks a moving nightly. mise resolves it to the concrete dev version it currently points at (e.g. 0.17.0-dev.836+...) at install time, so the install lands in a versioned directory and mise upgrade zig / mise outdated pick up newer nightlies — instead of the channel staying pinned to the build it was first installed from. Run mise upgrade zig (or mise install -f zig@master) to move to the current nightly.

The zig language server (zls) needs to be installed separately. You can install it with mise:

Note that a tagged release of zig should be used with the same tagged release of zls. Currently there is no Mach version of zls.

The following tool-options are available for the zig backend. These options go in the [tools] section in mise.toml.

Set environment variables for install-time commands run by the core zig backend:

This setting allows mise to fetch Zig from one of many community-maintained mirrors.

The ziglang.org website does not offer any uptime or speed guarantees, and it recommends to use the mirrors. The mirror list is cached and allows the installs to succeed even if the main server is unavailable.

The downloaded tarballs are always verified against Zig Software Foundation's public key, so there is no risk of third-party modifications. Read more on ziglang.org.

If you don't have the mirror list cached locally, you can place the newline-separated server list inside mise cache path, folder zig as community-mirrors.txt.

**Examples:**

Example 1 (sql):
```sql
mise use -g zig@0.14           # install zig 0.14.x
mise use -g zig@latest         # install latest zig release
mise use -g zig@master         # install latest nightly from master
mise use -g zig@2024.11.0-mach # install Mach nominated zig
mise use -g zig@mach-latest    # install latest Mach nominated zig
```

Example 2 (unknown):
```unknown
curl https://machengine.org/zig/index.json | yq 'keys'
```

Example 3 (elixir):
```elixir
mise use -g zls@0.14   # install zls 0.14.x
mise use -g zls@latest # install latest zls release
```

Example 4 (json):
```json
[tools]
zig = { version = "latest", install_env = { HTTPS_PROXY = "http://proxy.example" } }
```

---

## Go | mise-en-place

**URL:** https://mise.jdx.dev/lang/go.html

**Contents:**
- Go ​
- Usage ​
- .go-version file support ​
- Default packages ​
- Tool Options ​
  - install_env ​
- Settings ​
  - go.default_packages_filedeprecated
  - go.download_mirror
  - go.repo

mise can be used to install and manage multiple versions of go on the same system.

The following are instructions for using the go mise core plugin. This is used when there isn't a git plugin installed named "go". If you want to use asdf-golang then use mise plugins install go GIT_URL.

The code for this is inside the mise repository at ./src/plugins/core/go.rs.

The following installs the latest version of go-1.21.x (if some version of 1.21.x is not already installed) and makes it the global default:

Minor go versions 1.20 and below require specifying prefix before the version number because the first version of each series was released without a .0 suffix, making 1.20 an exact version match:

mise uses a mise.toml or .tool-versions file for auto-switching between software versions. However, it can also read go-specific version files named .go-version.

See idiomatic version files

Default package files are deprecated. They are still supported for now, but mise will start warning in 2026.11.0 and support will be removed in 2027.11.0.

For Go CLIs, install the tool directly with the go: backend:

For packages that really should be installed into every Go version, use a tool-level postinstall hook:

mise can automatically install a default set of packages right after installing a new go version. To use this legacy feature, provide a $HOME/.default-go-packages file that lists one package per line, for example:

The following tool-options are available for the go backend. These options go in the [tools] section in mise.toml.

Set environment variables for default package installation and install-time verification commands run by the core go backend:

Path to a file containing default go packages to install when installing go.

Mirror to download go sdk tarballs from.

URL to fetch go from.

Defaults to ~/.local/share/mise/installs/go/.../bin. Set to true to override GOBIN if previously set. Set to false to not set GOBIN (default is ${GOPATH:-$HOME/go}/bin).

[deprecated] Set to true to set GOPATH=~/.local/share/mise/installs/go/.../packages.

Sets GOROOT=~/.local/share/mise/installs/go/.../.

Set to true to skip checksum verification when downloading go sdk tarballs.

**Examples:**

Example 1 (elixir):
```elixir
mise use -g go@1.21
```

Example 2 (elixir):
```elixir
mise use -g go@prefix:1.20
```

Example 3 (json):
```json
[tools]
"go:github.com/jesseduffield/lazygit" = "latest"
```

Example 4 (elixir):
```elixir
[tools]
go = { version = "1.25", postinstall = "go install github.com/daixiang0/gci@latest" }
```

---

## Rust | mise-en-place

**URL:** https://mise.jdx.dev/lang/rust.html

**Contents:**
- Rust ​
- Usage ​
- Tool Options ​
  - install_env ​
  - components ​
  - profile ​
  - targets ​
- Settings ​
  - rust.cargo_home
  - rust.default_host

Rust/cargo can be installed which uses rustup under the hood. mise will install rustup if it is not already installed and add the requested targets. By default, mise respects the RUSTUP_HOME and CARGO_HOME environment variables for the home directories and falls back to their standard location (~/.rustup and ~/.cargo) if they are not set. You can change this by setting the MISE_RUSTUP_HOME and MISE_CARGO_HOME environment variables if you'd like to isolate mise's rustup/cargo from your other rustup/cargo installations.

Unlike most tools, these won't exist inside of ~/.local/share/mise/installs because they are managed by rustup. All mise does is set the RUSTUP_TOOLCHAIN environment variable to the requested version and rustup will automatically install it if it doesn't exist.

Use the latest stable version of rust:

Use the latest beta version of rust:

Use a specific version of rust:

The following tool-options are available for the rust backend—these go in [tools] in mise.toml.

Set environment variables for rustup install commands:

The components option allows you to specify which components to install. Multiple components can be specified by separating them with a comma. The set of available components may vary with different releases and toolchains. Please consult the Rust documentation for the most up-to-date list of components.

The profile option allows you to specify the type of release to install. The following values are supported:

If not set, it defaults to the profile configured in rustup. You can check your current default by running rustup show profile.

The targets option allows you to specify a list of platforms to install for cross-compilation. Multiple targets can be specified by separating them with a comma.

Path to the cargo home directory. Defaults to ~/.cargo or %USERPROFILE%\.cargo

Default host triple to pass to rustup init via --default-host.

Path to the rustup home directory. Defaults to ~/.rustup or %USERPROFILE%\.rustup

**Examples:**

Example 1 (unknown):
```unknown
mise use -g rust
cargo build
```

Example 2 (elixir):
```elixir
mise use -g rust@beta
cargo build
```

Example 3 (elixir):
```elixir
mise use -g rust@1.82
cargo build
```

Example 4 (json):
```json
[tools]
rust = { version = "latest", install_env = { RUSTUP_DIST_SERVER = "https://static.rust-lang.org" } }
```

---

## Bun | mise-en-place

**URL:** https://mise.jdx.dev/lang/bun.html

**Contents:**
- Bun ​
- Usage ​
- Tool Options ​
  - install_env ​

mise can be used to install and manage multiple versions of bun on the same system.

The following are instructions for using the bun mise core plugin. This is used when there isn't a git plugin installed named "bun".

The code for this is inside the mise repository at ./src/plugins/core/bun.rs.

The following installs bun and makes it the global default:

See available versions with mise ls-remote bun.

Avoid using bun upgrade to upgrade bun as mise will not be aware of the change.

The following tool-options are available for the bun backend. These options go in the [tools] section in mise.toml.

Set environment variables for install-time commands run by the core bun backend:

**Examples:**

Example 1 (elixir):
```elixir
mise use -g bun@0.7     # install bun 0.7.x
mise use -g bun@latest  # install latest bun
```

Example 2 (json):
```json
[tools]
bun = { version = "latest", install_env = { HTTPS_PROXY = "http://proxy.example" } }
```

---
