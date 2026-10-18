# Mise - Other

**Pages:** 60

---

## asdf (Legacy) Plugins | mise-en-place

**URL:** https://mise.jdx.dev/asdf-legacy-plugins.html

**Contents:**
- asdf (Legacy) Plugins ​
- What are asdf (Legacy) Plugins? ​
- Limitations ​
- When to Use asdf (Legacy) Plugins ​
- Installing asdf (Legacy) Plugins ​
  - From the Registry ​
  - From Git Repository ​
  - Manual Installation ​
- Plugin Structure ​
- Required Scripts ​

asdf plugins are considered legacy. New asdf and vfox plugins are not accepted into the mise registry for supply-chain security reasons — for registry submissions use the aqua (preferred) or github backend instead.

If you are writing a private/custom plugin (not for registry submission), prefer vfox plugins over asdf — they're written in Lua, work cross-platform (including Windows), and have access to built-in modules. See the feature comparison and hook migration table for details.

mise maintains compatibility with the asdf plugin ecosystem through its asdf backend. These plugins are considered legacy because they have limitations compared to mise's modern plugin system.

asdf plugins are shell script-based plugins that follow the asdf plugin specification. They were the original way to extend tool management in the asdf ecosystem and are now supported by mise for backward compatibility.

asdf plugins have several limitations compared to mise's modern plugin system:

Only use asdf plugins when:

For new tools, consider these alternatives first:

Most popular asdf plugins are available through mise's registry:

asdf plugins follow this directory structure:

Lists all available versions of the tool:

Downloads the tool source/binary:

Set environment variables when executing tools:

Get the latest stable version:

List legacy version file names:

Parse legacy version files:

asdf plugins have access to these environment variables:

Here's a minimal example for a fictional tool:

Consider migrating from asdf plugins to modern alternatives:

asdf plugins execute arbitrary shell scripts, which poses security risks:

**Examples:**

Example 1 (elixir):
```elixir
# Install from registry shorthand
mise use postgres@15

# This is equivalent to
mise use asdf:mise-plugins/mise-postgres@15
```

Example 2 (sql):
```sql
# Install plugin directly from repository
mise plugin install <plugin-name> <git-url>

# Example: PostgreSQL plugin
mise plugin install postgres https://github.com/mise-plugins/mise-postgres
```

Example 3 (elixir):
```elixir
# Add plugin manually
mise plugin add postgres https://github.com/mise-plugins/mise-postgres

# Install tool version
mise install postgres@15.0.0

# Use the tool
mise use postgres@15.0.0
```

Example 4 (sql):
```sql
plugin-name/
├── bin/
│   ├── list-all          # List all available versions
│   ├── download          # Download source code/binary
│   ├── install           # Install the tool
│   ├── latest-stable     # Get latest stable version [optional]
│   ├── help.overview     # Plugin description [optional]
│   ├── help.deps         # Plugin dependencies [optional]
│   ├── help.config       # Plugin configuration [optional]
│   ├── help.links        # Plugin links [optional]
│   ├── list-legacy-filenames  # Legacy version files [optional]
│   ├── parse-legacy-file # Parse legacy version files [optional]
│   ├── post-plugin-add   # Post plugin addition hook [optional]
│   ├── post-plugin-update # Post plugin update hook [optional]
│   ├── pre-plugin-remove # Pre plugin removal hook [optional]
│   └── exec-env          # Set execution environment [optional]
├── lib/                  # Shared library code [optional]
└── README.md
```

---

## Team | mise-en-place

**URL:** https://mise.jdx.dev/team.html

**Contents:**
- Team ​
- Jeff Dickey
- Advisory Board ​
- Justin "J.R." Hill
- Pedro Piñera Buendía
- Chad Crawford
- Contributors ​

Jeff Dickey is the primary developer behind mise. He does the bulk of development for the project.

The advisory board helps make important decisions about the project such as:

mise is an open source project which welcomes contributions. We're grateful for those that have volunteered their work for the project.

---

## FAQs | mise-en-place

**URL:** https://mise.jdx.dev/faq.html

**Contents:**
- FAQs ​
- I don't want to put a mise.toml/.tool-versions file into my project since git shows it as an untracked file ​
- What is the difference between "nodejs" and "node" (or "golang" and "go")? ​
- What does mise activate do? ​
- Windows support? ​
- How do I use mise with http proxies? ​
- How do the shorthand plugin names map to repositories? ​
- Does "node@20" mean the newest available version of node? ​
- How do I migrate from asdf? ​
- How compatible is mise with asdf? ​

Use mise.local.toml and put that into your global gitignore file. This file should never be committed.

If you really want to use a mise.toml or .tool-versions, here are 3 ways to make git ignore these files:

These are aliased. For example, mise use nodejs@14.0 is the same as mise install node@14.0. This means it is not possible to have these be different plugins.

This is for convenience so you don't need to remember which one is the "official" name. However if something with the aliasing is acting up, submit a ticket or just stick to using "node" and "go". Under the hood, when mise reads a config file or takes CLI input it will swap out "nodejs" and "golang".

It registers a shell hook to run mise hook-env every time the shell prompt is displayed. mise hook-env checks the current env vars (most importantly PATH but there are others like GOROOT or JAVA_HOME for some tools) and adds/removes/updates the ones that have changed.

For example, if you cd into a different directory that has java 18 instead of java 17 specified, just before the next prompt is displayed the shell runs: eval "$(mise hook-env)" which will execute something like this in the current shell session:

In reality updating PATH is a bit more complex than that because it also needs to remove java-17, but you get the idea.

You may think that is excessive to run mise hook-env every time the prompt is displayed and it should only run on cd, however there are plenty of situations where it needs to run without the directory changing, for example if .tool-versions or mise.toml was just edited in the current shell.

Because it runs on prompt display, if you attempt to use mise activate in a non-interactive session (like a bash script), it will never call mise hook-env and in effect will never modify PATH because it never displays a prompt. For this type of setup, you can either call mise hook-env manually every time you wish to update PATH, or use shims instead (preferred). Or if you only need to use mise for certain commands, just prefix the commands with mise x --. For example, mise x -- npm test or mise x -- ./my_script.sh.

mise hook-env will exit early in different situations if no changes have been made. This prevents adding latency to your shell prompt every time you run a command. You can run mise hook-env yourself to see what it outputs, however it is likely nothing if you're in a shell that has already been activated.

mise activate also creates a shell function (in most shells) called mise. This is a trick that makes it possible for mise shell and mise deactivate to work without wrapping them in eval "$(mise shell)".

While mise runs great in WSL, native Windows is also supported, though via the use of shims until someone adds powershell support.

As you'll need to use shims, this means you won't have environment variables from mise.toml unless you run mise via mise x or mise run.

Short answer: just set http_proxy and https_proxy environment variables. These should be lowercase.

This may not work with all plugins if they are not configured to use these env vars. If you're having a proxy-related issue installing something specific you should post an issue on the plugin's repository.

e.g.: how does mise plugin install elixir know to fetch https://github.com/asdf-vm/asdf-elixir?

We maintain an index of shorthands that mise uses as a base. This is regularly updated every time that mise has a release. This repository is stored directly into the codebase in registry/.

It depends on the command. Normally, for most commands and inside of config files, "node@20" will point to the latest installed version of node-20.x. You can find this version by running mise latest --installed node@20 or by seeing what the ~/.local/share/mise/installs/node/20 symlink points to:

There are some exceptions to this, such as the following:

These will use the latest available version of node-20.x. This generally makes sense because you wouldn't want to install a version that is already installed.

Note that mise does not consider ~/.tool-versions files to be a global config file like asdf does. mise uses a ~/.config/mise/config.toml file for global configuration.

Here is an example script you can use to migrate your global .tool-versions file to mise:

Once you are comfortable with mise, you can remove the .tool-versions.bak file and uninstall asdf

mise should be able to read/install any .tool-versions file used by asdf. Any asdf plugin should be usable in mise. The commands in mise are slightly different, such as mise install node@20.0.0 vs asdf install node 20.0.0—this is done so multiple tools can be specified at once. However, asdf-style syntax is still supported: (mise install node 20.0.0). This is the case for most commands, though the help for the command may say that asdf-style syntax is supported. When in doubt, just try asdf syntax and see if it works—it probably does.

UPDATE (2025-01-01): mise was designed to be compatible with the asdf written in bash (<=0.15). The new asdf written in go (>=0.16) has commands mise does not support like asdf set. mise set is an existing command that is completely different than asdf set—in mise that sets env vars.

This isn't important for usability reasons so much as making it so plugins continue to work that call asdf commands inside of the plugin code.

Using commands like mise use may output .tool-versions files that are not compatible with asdf, such as using fuzzy versions. You can set --pin or MISE_PIN=1 to make mise use output asdf-compatible versions in .tool-versions. Alternatively, you can have mise.toml and .tool-versions sitting side-by-side. mise.toml tools will override tools defined in a .tool-versions in the same directory.

That said, in general compatibility with asdf is no longer a design goal. It's long been the case that there is no reason to prefer asdf to mise so users should migrate. While plenty of users have teams which use both in tandem, issues with such a setup are unlikely to be prioritized.

mise uses console.rs which honors the clicolors spec:

Providing a secure supply chain is incredibly important. mise already provides a more secure experience when compared to asdf. Security-oriented evaluations and contributions are welcome. We also urge users to look after the plugins they use, and urge plugin authors to look after the users they serve.

For more details see SECURITY.md.

usage (https://usage.jdx.dev/) is a spec and CLI for defining CLI tools.

Arguments, flags, environment variables, and config files can all be defined in a Usage spec. It can be thought of like OpenAPI (swagger) for CLIs.

usage can be installed with mise using mise use -g usage and is required to get the autocompletion working. See autocompletion.

You can leverage usage in file tasks to get auto-completion working, see file tasks arguments.

pitchfork (https://pitchfork.jdx.dev/) is a process manager for developers.

It handles daemon management with features like automatic restarts on failure, smart readiness checks, shell-based auto-start/stop when entering project directories, and cron-style scheduling for periodic tasks.

In VSCode, many extensions will throw an "error spawn EINVAL" due to a Node.js security fix.

The default exe shim mode should resolve this. If you're using an older mode, you can change windows_shim_mode to exe, hardlink, or symlink.

mise install downloads and installs a tool version but does not add it to any config file. The tool won't be automatically activated in your shell unless it's already listed in a mise.toml or .tool-versions.

mise use installs the tool and adds it to mise.toml (or ~/.config/mise/config.toml with -g), so it will be activated automatically when you enter the directory.

If you just want to pin a tool for a project, use mise use. If you want to install a version that's already listed in config, use mise install.

mise install node (with no version) will install the latest version if node isn't in your config. mise install (with no arguments) installs only the tools listed in your config files.

It depends on context. In config files and most commands, latest resolves to the latest installed version. This means if you have node 20.0.0 installed and node 22.0.0 is available remotely, latest will still point to 20.0.0.

However, some commands resolve latest to the newest available (remote) version:

To upgrade to the newest available version and update your config, run:

mise requires you to trust config files that were not created by you. Safe config files — those that only contain min_version, [tools] entries with plain version strings (or arrays of them), and [tasks] (no templates and no tool options) — are loaded without trust, since nothing in them executes code at load time: tools install and tasks run only on explicit commands like mise install or mise run. Everything else (env vars, hooks, settings, aliases, templates, tool options) requires trust. Common issues:

Run mise doctor (mise dr) to see if any config files are untrusted — it will list them under "problems".

Idiomatic version files (.python-version, .node-version, .ruby-version, etc.) are disabled by default in mise. They are only read if you explicitly opt in per tool using idiomatic_version_file_enable_tools:

If you previously enabled idiomatic files and now want to stop mise from reading them (e.g., because uv manages .python-version), simply don't add that tool to the list.

See Idiomatic Version Files for more information.

These all do the same core thing: they set up your environment (primarily PATH) so that mise-managed tools are available. The difference is when and how:

mise activate --shims does not support hooks, env vars from [env], or watch_files. It only puts shims on PATH. If you need those features, use mise activate (without --shims).

mise exec (or mise x) reads your config, sets up PATH and environment variables, then runs the command you specify after --:

A common pattern on Discord is mise x node@20 -- node script.js when node@20 is already in mise.toml. This works but is redundant — mise x -- node script.js is simpler when you just want the configured version.

mise use writes to the nearest mise.toml in your directory hierarchy. If there's a mise.toml in a parent directory (including ~/.config/mise/config.toml for -g), it will update that file.

Use mise cfg to see which config files mise is reading in the current directory.

mise manages development tool versions (node, python, go, rust, etc.) and CLI utilities. It is not a replacement for system package managers like apt, brew, or pacman.

Things mise does not do:

If a mise-installed tool needs a system library, install that library with your OS package manager first.

mise uses Calver versioning (2024.1.0). Breaking changes will be few but when they do happen, they will be communicated in the CLI with plenty of notice whenever possible.

Rather than have SemVer major releases to communicate change in large releases, new functionality and changes can be opted-into with settings like experimental = true. This way plugin authors and users can test out new functionality immediately without waiting for a major release.

The numbers in Calver (YYYY.MM.RELEASE) simply represent the date of the release—not compatibility or how many new features were added. Each release will be small and incremental.

**Examples:**

Example 1 (bash):
```bash
export JAVA_HOME=$HOME/.local/share/installs/java/18
export PATH=$HOME/.local/share/installs/java/18/bin:$PATH
```

Example 2 (lua):
```lua
$ ls -l ~/.local/share/mise/installs/node/20
[...] /home/jdx/.local/share/mise/installs/node/20 -> node-v20.0.0-linux-x64
```

Example 3 (unknown):
```unknown
mv ~/.tool-versions ~/.tool-versions.bak
cat ~/.tool-versions.bak | tr -s ' ' | tr ' ' '@' | xargs -n2 mise use -g
```

Example 4 (sql):
```sql
mise upgrade node
# or to also update mise.toml:
mise upgrade --bump node
```

---

## Dotfiles | mise-en-place

**URL:** https://mise.jdx.dev/dotfiles.html

**Contents:**
- Dotfiles experimental ​
- Whole-file entries ​
- Modes ​
- Edit entries ​
- Semantics ​
- Conflicts ​
- Commands ​
- Capturing changes ​
- Self-managing mise config ​
- Root-owned files ​

mise can manage dotfiles from the [dotfiles] section of mise.toml. Entries can either own a whole file or directory, or manage one small piece of a file something else owns.

Dotfiles are only applied when explicitly requested with mise dotfiles apply or mise bootstrap. They are never applied implicitly by mise install or mise bootstrap packages.

Whole-file entries are keyed by the target path — absolute or starting with ~/ — and may point at a source file or directory. If source is omitted, mise mirrors the home-relative target path under dotfiles.root: ~/.zshrc uses ~/.dotfiles/.zshrc, and ~/.config/foo.toml uses ~/.dotfiles/.config/foo.toml. Targets outside $HOME must specify source.

String entries are shorthand for an explicit source with dotfiles.default_mode. Commands that write [dotfiles] always write table form with mode, even when it is the default:

Relative explicit sources resolve against the directory of the config file that declares the entry, so a global ~/.config/mise/config.toml can manage dotfiles kept next to it, and a project config can ship machine setup from the repo.

Source paths may contain glob wildcards like *, **, ?, or [ab]. When a wildcard source matches multiple paths, the target path must contain matching wildcards so each source expands to a unique target:

Templates get the same context as other mise templates (env, vars, exec(), etc.), which is the main reason to use them: one source file, per-machine output.

Detecting whether a template's output has drifted requires rendering it, so mise dotfiles status and a real apply evaluate templates — including any exec() calls — from your trusted config, just like [env] templates. --dry-run is the exception: it promises to execute nothing, so it skips template rendering and lists those entries as (if changed).

Edit entries manage one piece of a file: the mise activate block in your shell rc, an entry in /etc/hosts, or a small snippet in a config file. They are keyed by target path plus an id naming each edit within the file:

For edit entries, source is paired with template = "tera" to make the entry unambiguously an edit. A table with only source is a whole-file entry using dotfiles.default_mode.

A block is delimited by marker comments in the target file, named by the entry's id:

The markers are the ownership record, stored in the file itself, so the design stays stateless: applying replaces only what's between them or appends the block if absent, and everything else in the file is untouched.

Ids may contain letters, digits, _, -, and .. The marker comment prefix is inferred from the file extension (# for shell/config files, -- for Lua, // for C-like languages, ; for INI, " for vim) and can be overridden with comment = "...". Files that can't hold line comments at all (strict JSON, XML) aren't a fit for blocks — use a whole-file entry instead.

A line ensures an exact line exists somewhere in the file, appending it at the end if absent. It never modifies or removes other lines, which is what makes it safely idempotent. The value must be a single line; use a block for multi-line content.

mise refuses to replace existing files it doesn't manage: a real file or directory where a symlink should go, or a directory where a file should go, is an error listing the conflicting paths. Pass mise dotfiles apply --force to replace them.

For symlink entries, an existing regular file with identical content to the source is converged without --force by replacing it with the requested symlink. If the content differs, mise still treats it as a conflict.

Content updates are not conflicts: a copy or template entry overwrites the target file's content without --force — that is the declared intent of those modes. Symlinks are re-pointed freely, since a symlink is never data.

Edit entries never need --force: a block owns only what's between its markers, and a line only ever appends. Two cases are refused with an error instead of guessed at: corrupted markers and targets that are symlinks. An edit through a symlink would modify whatever the link points at, often a [dotfiles] source, so point the edit at the real file instead.

Removing an entry from config leaves its file, block, or line in place because mise keeps no state database. Delete unmanaged leftovers by hand.

mise dotfiles status reports each entry as applied, missing, differs with a reason, or source missing.

If you edit a copied dotfile in place and want to store those changes back in your dotfiles, run mise dotfiles add again:

For an unmanaged target, add creates a [dotfiles] entry and seeds the source under dotfiles.root. For an already-managed target, it updates the existing source from the live target.

You can manage the mise config and the dotfiles root as dotfiles too:

This is a bootstrap pattern: clone the real repo (for example ~/src/dotfiles) before the first mise dotfiles apply or mise bootstrap. Use the real repo path for sources needed during the first run; ~/.dotfiles does not exist until mise creates that symlink. Replacing ~/.config/mise/config.toml affects future mise invocations, so make sure the source contains a valid config before applying it.

Dotfiles write as the current user — there is no sudo here. Managing /etc/hosts works when running as root (containers, CI); otherwise mise fails with an ordinary permission error.

File symlinks require elevation on Windows, so symlink and symlink-each fall back to copying for files there; directory symlinks use junctions.

**Examples:**

Example 1 (json):
```json
[settings]
dotfiles.root = "~/.dotfiles"
dotfiles.default_mode = "symlink"

[dotfiles]
"~/.zshrc" = {}                                                       # ~/.dotfiles/.zshrc
"~/.gitconfig" = "dotfiles/gitconfig"                                # explicit source
"~/.config/alacritty.toml" = { mode = "copy" }                       # ~/.dotfiles/.config/alacritty.toml
"~/.config/starship.toml" = { source = "dotfiles/starship.toml", mode = "copy" }
"~/.ssh/config" = { source = "dotfiles/ssh_config.tmpl", mode = "template" }
"~/.config/nvim" = "dotfiles/nvim"                                   # symlink the directory itself
"~/.local/bin" = { source = "dotfiles/bin", mode = "symlink-each" }  # symlink each file within
"~/hosts/dev" = { line = "127.0.0.1 dev.local" }                     # edit one line in ~/hosts
```

Example 2 (json):
```json
[dotfiles]
"~/.zshrc" = { mode = "symlink" }
"~/.ssh/config" = { source = "ssh/config", mode = "copy" }
```

Example 3 (swift):
```swift
[dotfiles]
"~/.config/*.toml" = "dotfiles/config/*.toml"
"~/.local/share/app/**/*.json" = { source = "dotfiles/app/**/*.json", mode = "copy" }
"~/.config/app?.toml" = "dotfiles/config/app?.toml"
"~/.config/theme-[ab].toml" = "dotfiles/config/theme-[ab].toml"
```

Example 4 (elixir):
```elixir
[dotfiles]
"~/.zshrc/activate" = { block = 'eval "$(mise activate zsh)"' }
"~/.zshrc/aliases" = { block = '''
alias ll='ls -l'
alias la='ls -la'
''' }
"/etc/hosts/dev" = { line = "127.0.0.1 dev.local" }
"~/.gitconfig/identity" = { source = "snippets/git-identity.tmpl", template = "tera" }
```

---

## Mise + Neovim Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/neovim.html

**Contents:**
- Mise + Neovim Cookbook ​
- Syntax highlighting ​
  - Run commands ​
  - MISE and USAGE comments in file tasks ​
- Enable LSP for embedded lang in run commands ​

Here are some tips for an improved mise workflow with Neovim.

Use Treesitter to enable syntax highlighting for the code in the run commands of your mise files. See the example here on the left side of the image:

In your neovim config, create a after/queries/toml/injections.scm file with these queries:

To only apply the highlighting on mise files instead of all toml files, the is-mise? predicate is used. If you don't care for this distinction, the lines containing (#is-mise?) can be removed. Otherwise, make sure to also create the predicate somewhere in your neovim config.

For example, using lazy.nvim:

This will consider any toml file containing mise in its name as a mise file.

You can also use Treesitter to enable syntax highlighting for "#MISE and #USAGE comments in file based tasks. See the example here on the left side of the image:

In your neovim config, create a after/queries/bash/injections.scm file with these queries:

The same queries work as is for all languages that use # as a comment delimiter. Due to TS injections being per language, you need to put the same queries to the language specific query files. For example, put them to after/queries/python/injections.scm to enable them for Python in addition to bash.

For languages that use // as a comment delimiter, you need to modify the queries a bit:

Use otter.nvim to enable LSP features and code completion for code embedded in your mise files.

Again using lazy.nvim:

This will only work if the TS injection queries are also set up.

**Examples:**

Example 1 (julia):
```julia
; extends

(pair
  (bare_key) @key (#eq? @key "run")
  (string) @injection.content @injection.language

  (#is-mise?)
  (#match? @injection.language "^['\"]{3}\n*#!(/\\w+)+/env\\s+\\w+") ; multiline shebang using env
  (#gsub! @injection.language "^.*#!/.*/env%s+([^%s]+).*" "%1") ; extract lang
  (#offset! @injection.content 0 3 0 -3) ; rm quotes
)

(pair
  (bare_key) @key (#eq? @key "run")
  (string) @injection.content @injection.language

  (#is-mise?)
  (#match? @injection.language "^['\"]{3}\n*#!(/\\w+)+\s*\n") ; multiline shebang
  (#gsub! @injection.language "^.*#!/.*/([^/%s]+).*" "%1") ; extract lang
  (#offset! @injection.content 0 3 0 -3) ; rm quotes
)

(pair
  (bare_key) @key (#eq? @key "run")
  (string) @injection.content

  (#is-mise?)
  (#match? @injection.content "^['\"]{3}\n*.*") ; multiline
  (#not-match? @injection.content "^['\"]{3}\n*#!") ; no shebang
  (#offset! @injection.content 0 3 0 -3) ; rm quotes
  (#set! injection.language "bash") ; default to bash
)

(pair
  (bare_key) @key (#eq? @key "run")
  (string) @injection.content

  (#is-mise?)
  (#not-match? @injection.content "^['\"]{3}") ; not multiline
  (#offset! @injection.content 0 1 0 -1) ; rm quotes
  (#set! injection.language "bash") ; default to bash
)
```

Example 2 (lua):
```lua
{
  "nvim-treesitter/nvim-treesitter",
  init = function()
    require("vim.treesitter.query").add_predicate("is-mise?", function(_, _, bufnr, _)
      local filepath = vim.api.nvim_buf_get_name(tonumber(bufnr) or 0)
      local filename = vim.fn.fnamemodify(filepath, ":t")
      return string.match(filename, ".*mise.*%.toml$") ~= nil
    end, { force = true, all = false })
  end,
},
```

Example 3 (elixir):
```elixir
; extends

; ============================================================================
; #MISE comments - TOML injection
; ============================================================================
; This injection captures comment lines starting with "#MISE " or "#[MISE]" or
; "# [MISE]" and treats them as TOML code blocks for syntax highlighting.
;
; #MISE format
; The (#offset!) directive skips the "#MISE " prefix (6 characters) from the source
((comment) @injection.content
  (#lua-match? @injection.content "^#MISE ")
  (#offset! @injection.content 0 6 0 1)
  (#set! injection.language "toml"))

; #[MISE] format
((comment) @injection.content
  (#lua-match? @injection.content "^#%[MISE%] ")
  (#offset! @injection.content 0 8 0 1)
  (#set! injection.language "toml"))

; # [MISE] format
((comment) @injection.content
  (#lua-match? @injection.content "^# %[MISE%] ")
  (#offset! @injection.content 0 9 0 1)
  (#set! injection.language "toml"))

; ============================================================================
; #USAGE comments - KDL injection
; ============================================================================
; This injection captures consecutive comment lines starting with "#USAGE " or
; "#[USAGE]" or "# [USAGE]" and treats them as a single KDL code block for
; syntax highlighting.
;
; #USAGE format
((comment) @injection.content
  (#lua-match? @injection.content "^#USAGE ")
  ; Extend the range one byte to the right, to include the trailing newline.
  ; see https://github.com/neovim/neovim/discussions/36669#discussioncomment-15054154
  (#offset! @injection.content 0 7 0 1)
  (#set! injection.combined)
  (#set! injection.language "kdl"))

; #[USAGE] format
((comment) @injection.content
  (#lua-match? @injection.content "^#%[USAGE%] ")
  (#offset! @injection.content 0 9 0 1)
  (#set! injection.combined)
  (#set! injection.language "kdl"))

; # [USAGE] format
((comment) @injection.content
  (#lua-match? @injection.content "^# %[USAGE%] ")
  (#offset! @injection.content 0 10 0 1)
  (#set! injection.combined)
  (#set! injection.language "kdl"))

; NOTE: on neovim >= 0.12, you can use the multi node pattern instead of
; combining injections:
;
; ((comment)+ @injection.content
;   (#lua-match? @injection.content "^#USAGE ")
;   (#offset! @injection.content 0 7 0 1)
;   (#set! injection.language "kdl"))
;
; this is the preferred way as combined injections have multiple
; limitations:
; https://github.com/neovim/neovim/issues/32635
```

Example 4 (elixir):
```elixir
((comment) @injection.content
  (#lua-match? @injection.content "^//MISE ")
  (#offset! @injection.content 0 7 0 1)
  (#set! injection.language "toml"))
((comment) @injection.content
  (#lua-match? @injection.content "^//%[MISE%] ")
  (#offset! @injection.content 0 9 0 1)
  (#set! injection.language "toml"))
((comment) @injection.content
  (#lua-match? @injection.content "^// %[MISE%] ")
  (#offset! @injection.content 0 10 0 1)
  (#set! injection.language "toml"))
((comment) @injection.content
  (#lua-match? @injection.content "^//USAGE ")
  (#offset! @injection.content 0 8 0 1)
  (#set! injection.combined)
  (#set! injection.language "kdl"))
((comment) @injection.content
  (#lua-match? @injection.content "^//%[USAGE%] ")
  (#offset! @injection.content 0 10 0 1)
  (#set! injection.combined)
  (#set! injection.language "kdl"))
((comment) @injection.content
  (#lua-match? @injection.content "^// %[USAGE%] ")
  (#offset! @injection.content 0 11 0 1)
  (#set! injection.combined)
  (#set! injection.language "kdl"))
```

---

## Coming from rtx | mise-en-place

**URL:** https://mise.jdx.dev/rtx.html

**Contents:**
- Coming from rtx ​

mise was formerly called rtx. The name was changed to avoid confusion with Nvidia's line of graphics cards. This wasn't a legal issue, but just general confusion. When people first hear about the project or see it posted they wouldn't realize it was talking about a CLI tool. It was a bit difficult to search for on Google but also places like Twitter and in Slack searches and things. This was the top complaint about rtx and many people were fairly outspoken about disliking the name for this reason. rtx was supposed to be a working title that I intended to change but never got around to doing. This change should've happened earlier when there were fewer users and I apologize for not having done that sooner knowing that this was likely going to be necessary at some point.

To upgrade from rtx to mise, simply install mise and it should automatically migrate its internal directories, moving ~/.local/share/rtx/installs/* to ~/.local/share/mise/installs/* (skipping python & ruby which cannot be moved), ~/.local/share/rtx/plugins to ~/.local/share/mise/plugins, and ~/.config/rtx to ~/.config/mise (if the destination does not exist). Python and Ruby installs will need to be reinstalled with mise install.

mise will continue reading .rtx.toml files for some time but that eventually will be deprecated so please rename them to mise.toml. mise will not read from RTX_* env vars so those will need to be changed to MISE_*. Anything using a local .rtx or .config/rtx directory will need to be moved to .mise/.config/mise.

I apologize if this migration is not seamless however I think moving to a name that is easier to search for and avoids confusion is better for everyone. I also apologize for it being abrupt—I simply couldn't think of a way to "slow roll" this change out while also keeping the GitHub repo.

Users of the rtx-action GitHub action will need to switch to mise-action (and also bump the major version to v2).

If you build infrastructure where users may still be calling rtx activate in their shell rc scripts, you can create a symlink ln -s /path/to/mise /path/to/rtx so rtx activate still functions.

For https://mise.run, we're using ~/.local/bin/mise as the executable PATH instead of the old directory ~/.local/share/rtx/bin/mise to keep things a bit cleaner. You can still use the old style if you like by setting MISE_INSTALL_PATH.

If you use shims, a mise reshim will be necessary to update the shims.

Thanks for trying out my little CLI tool by the way. I find this project incredibly fulfilling to work on and seeing people have success using. I have tremendous passion for building dev tools and the ideas in mise are the product of me thinking about building a tool like this for over a decade.

If you aren't happy with mise or the way I'm running this project, even in a tiny way, please let me know. You can contact me privately if you like. I certainly won't take offense and I would prefer you say something rather than nothing. Otherwise I'll never know.

---

## Plugin Lua Modules | mise-en-place

**URL:** https://mise.jdx.dev/plugin-lua-modules.html

**Contents:**
- Plugin Lua Modules ​
- Available Modules ​
  - Core Modules ​
- HTTP Module ​
  - Basic HTTP Requests ​
  - HEAD Requests ​
  - File Downloads ​
  - Non-Raising Variants (try_*) ​
  - Response Object ​
- JSON Module ​

mise plugins have access to a comprehensive set of built-in Lua modules that provide common functionality. These modules are available in both backend plugins and tool plugins, making it easy to perform common operations like HTTP requests, JSON parsing, file operations, and more.

The HTTP module provides functionality for making web requests and downloading files.

The standard http.get, http.head, and http.download_file methods raise a Lua error on transport failures (timeouts, DNS errors, connection refused, etc.). Since pcall() cannot catch errors from async functions in this environment, non-raising variants are provided:

HTTP responses contain the following fields:

The JSON module provides encoding and decoding functionality.

The strings module provides various string manipulation utilities.

The semver module provides semantic version comparison and sorting functionality. This is useful for sorting version lists returned by Available() hooks.

The HTML module provides HTML parsing capabilities.

The archiver module provides functionality for extracting compressed archives.

The file module provides file system operations.

The file.join_path(...) function joins any number of path segments using the correct separator for the current operating system. This is the recommended way to construct file paths in cross-platform plugins.

The env module provides environment variable operations.

To read variables in Lua, use os.getenv("MY_VAR").

The cmd module provides shell command execution.

The options table supports the following keys:

When cmd.exec() is called from environment module hooks (MiseEnv, MisePath), the command automatically inherits the mise-constructed environment instead of the process environment. This includes environment variables set by preceding directives and _.path entries accumulated so far.

When the module directive has tools = true, the inherited environment also includes tool installation bin paths. This means mise-managed tools are directly callable:

Without tools = true, only _.path directive entries and the original system PATH are available to cmd.exec().

Any explicit env options passed to cmd.exec() are merged on top of the inherited environment, allowing selective overrides.

The log module provides structured logging that routes through Rust's log crate, respecting MISE_DEBUG and MISE_TRACE environment variables.

All log functions accept multiple arguments of any type. Arguments are converted to strings via tostring() and joined with tab characters (\t), matching Lua's print() behavior:

All log messages are automatically prefixed with [plugin_name]:

print() is overridden to route through info!() level logging. This means:

The log module is also available as vfox.log:

Always handle errors gracefully:

Implement caching for expensive operations:

Handle cross-platform differences:

**Examples:**

Example 1 (lua):
```lua
local http = require("http")

-- GET request
local resp, err = http.get({
    url = "https://api.github.com/repos/owner/repo/releases",
    headers = {
        ['User-Agent'] = "mise-plugin",
        ['Accept'] = "application/json"
    }
})

if err ~= nil then
    error("Request failed: " .. err)
end

if resp.status_code ~= 200 then
    error("HTTP error: " .. resp.status_code)
end

local body = resp.body
```

Example 2 (lua):
```lua
local http = require("http")

-- HEAD request to check file info
local resp, err = http.head({
    url = "https://example.com/file.tar.gz"
})

if err ~= nil then
    error("HEAD request failed: " .. err)
end

local content_length = resp.headers['content-length']
local content_type = resp.headers['content-type']
```

Example 3 (lua):
```lua
local http = require("http")

-- Download file
local err = http.download_file({
    url = "https://github.com/owner/repo/archive/v1.0.0.tar.gz",
    headers = {
        ['User-Agent'] = "mise-plugin"
    }
}, "/path/to/download.tar.gz")

if err ~= nil then
    error("Download failed: " .. err)
end
```

Example 4 (lua):
```lua
local http = require("http")

-- try_get: returns (resp, nil) on success, (nil, err_string) on failure
local resp, err = http.try_get({
    url = "https://primary.example.com/index"
})
if err ~= nil then
    -- fall back to another source
    resp, err = http.try_get({ url = "https://fallback.example.com/index" })
end

-- try_head: same return convention as try_get
local resp, err = http.try_head({ url = "https://example.com/file.tar.gz" })

-- try_download_file: returns (true, nil) on success, (nil, err_string) on failure
local ok, err = http.try_download_file({
    url = "https://example.com/archive.tar.gz"
}, "/path/to/download.tar.gz")
if err ~= nil then
    error("Download failed: " .. err)
end
```

---

## Mise + Docker Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/docker.html

**Contents:**
- Mise + Docker Cookbook ​
- Docker image with mise ​
- Shared tools in multi-user containers ​
  - Devcontainers with home directory mounts ​
- Overriding libc detection ​
- Task to run mise in a Docker container ​

Here are some tips on using Docker with mise.

Here is an example Dockerfile showing how to install mise in a Docker image.

Build and run the Docker image:

For toolbox containers or bastion hosts where tools should be pre-installed for all users, use mise install --system to install tools into /usr/local/share/mise/installs. Each user's mise will automatically find these system-level tools without any configuration.

The following example also shows installing using extrepo on Debian/Ubuntu image. With this approach you cannot specify MISE_VERSION or MISE_INSTALL_PATH.

Users in the container will see these tools automatically:

Users can install additional versions in their own directory — those take priority over system versions. To customize the system directory, set MISE_SYSTEM_DATA_DIR.

You can also configure additional shared directories with MISE_SHARED_INSTALL_DIRS (paths separated by : on Unix and ; on Windows) or the shared_install_dirs setting.

Devcontainers often mount the user's home directory, which means ~/.local/share/mise/installs comes from the mount rather than the Docker image. Tools pre-installed during docker build into ~/.local/share/mise/installs would be hidden by the mount.

Use mise install --system to install tools to /usr/local/share/mise/installs instead — this path is outside ~ and survives home directory mounts:

When the container starts with ~ mounted, users still see the system tools automatically. Any tools they install normally go to ~/.local/share/mise/installs (on the mount) and take priority over system versions.

In minimal Docker images (scratch, busybox, distroless) where no dynamic linker files exist, mise may not detect whether the system uses musl or glibc. Set libc or MISE_LIBC to force the detection:

Valid values are musl, glibc, and gnu (case-insensitive, with gnu treated as glibc). Invalid values are silently ignored and mise falls back to runtime detection. When the mise binary is compiled for musl (the default for Linux releases), it will also fall back to musl automatically when no linker is detected.

This can be useful if you need to reproduce an issue you're having with mise in a clean environment.

Build the image first (see above), then:

**Examples:**

Example 1 (sql):
```sql
FROM debian:13-slim

RUN apt-get update  \
    && apt-get -y --no-install-recommends install  \
        # install any other dependencies you might need
        sudo curl git ca-certificates build-essential \
    && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:$PATH"
# ENV MISE_VERSION="..."

RUN curl https://mise.run | sh
```

Example 2 (unknown):
```unknown
docker build -t debian-mise .
docker run -it --rm debian-mise
```

Example 3 (sql):
```sql
# syntax=docker/dockerfile:1
FROM debian:13-slim

RUN <<EOF
  set -ex
  apt-get update
  apt-get install -y extrepo
  extrepo enable mise
  apt-get remove -y --auto-remove extrepo # extrepo and its deps are not needed after extrepo enable
  apt-get update
  apt-get install -y mise build-essential
  rm -fr /var/lib/apt/lists/*
EOF

# Pre-install tools to the system-wide shared directory
RUN mise install --system node@26 python@3.15
```

Example 4 (unknown):
```unknown
$ mise ls
node    26.0.0 (system)
python  3.15.0 (system)
```

---

## Shell Aliases | mise-en-place

**URL:** https://mise.jdx.dev/shell-aliases.html

**Contents:**
- Shell Aliases ​
- Configuration ​
- Supported Shells ​
- Dynamic Behavior ​
- Hierarchy ​
- Templates ​
- Use Cases ​
  - Project-Specific Shortcuts ​
  - Tool Wrappers ​
  - Quick Navigation ​

mise can manage shell aliases that are set dynamically when you enter a directory and unset when you leave, similar to how environment variables work.

Shell aliases are defined in mise.toml under the [shell_alias] section:

When you enter a directory with this configuration, these aliases will be automatically set in your shell. When you leave the directory (and the new directory doesn't have the same aliases), they will be unset.

Shell aliases are currently supported in:

Other shells (nushell, elvish, xonsh, powershell) do not currently support shell aliases.

Shell aliases work similarly to environment variables managed by mise:

Like other mise config, shell aliases from parent directories are available in child directories. A child directory can override a parent's alias:

Alias values support templates, allowing dynamic values:

Define shortcuts that only make sense within a specific project:

Create aliases that wrap tools with project-specific defaults:

mise has two different alias features that serve different purposes:

See Tool Aliases for documentation on aliasing tool versions.

**Examples:**

Example 1 (json):
```json
[shell_alias]
ll = "ls -la"
la = "ls -A"
gs = "git status"
gc = "git commit"
```

Example 2 (elixir):
```elixir
$ cd ~/myproject
# mise sets: alias ll='ls -la'

$ ll
# Runs: ls -la

$ cd ~
# mise runs: unalias ll
```

Example 3 (json):
```json
# ~/projects/mise.toml
[shell_alias]
build = "make build"

# ~/projects/myapp/mise.toml
[shell_alias]
build = "npm run build"  # Overrides parent
```

Example 4 (json):
```json
[shell_alias]
proj = "cd {{config_root}}"
node_version = "echo {{exec(command='node --version')}}"
```

---

## Model Context Protocol (MCP) | mise-en-place

**URL:** https://mise.jdx.dev/mcp.html

**Contents:**
- Model Context Protocol (MCP) ​
- Overview ​
- Usage ​
- Available Resources ​
  - mise://tools ​
  - mise://tasks ​
  - mise://env ​
  - mise://config ​
- Available Tools ​
  - install_tool ​

The Model Context Protocol (MCP) is a standard protocol that enables AI assistants to interact with development tools and access project context. Mise provides an MCP server that allows AI assistants to query information about your development environment.

When you run mise mcp, it starts a server that AI assistants can connect to and query information about your mise-managed development environment. The server communicates over stdin/stdout using JSON-RPC protocol.

The MCP feature is experimental and requires enabling experimental features with MISE_EXPERIMENTAL=1.

The MCP server is typically launched by AI assistants automatically, but you can also run it manually for testing:

The MCP server exposes the following read-only resources that AI assistants can query:

Lists all tools managed by mise in your project, including:

Shows all available mise tasks with:

Displays environment variables defined in your mise configuration:

Provides information about mise configuration:

The following tools are available for AI assistants to call:

Install a specific tool version (not yet implemented)

Execute a mise task with optional arguments.

When the AI assistant calls this tool, it will execute the specified task and return the output, including stdout, stderr, and the exit status.

To use mise with Claude Desktop, add the following to your Claude configuration file:

macOS: ~/Library/Application Support/Claude/claude_desktop_config.jsonWindows: %APPDATA%\Claude\claude_desktop_config.jsonLinux: ~/.config/claude/claude_desktop_config.json

After adding this configuration and restarting Claude Desktop, the assistant will be able to:

The MCP server uses standard JSON-RPC 2.0 over stdio, making it compatible with any AI assistant that supports the Model Context Protocol. Consult your AI assistant's documentation for specific integration instructions.

When integrated with an AI assistant, you can ask questions like:

The AI assistant will query the MCP server to provide accurate, up-to-date information about your development environment and can execute tasks on your behalf.

The MCP server implementation can be found in src/cli/mcp.rs. It implements the ServerHandler trait from the rmcp crate to handle:

For more information about the Model Context Protocol, visit the official MCP documentation.

**Examples:**

Example 1 (sass):
```sass
# Enable experimental features
export MISE_EXPERIMENTAL=1

# Start the MCP server (it will wait for JSON-RPC input on stdin)
mise mcp
```

Example 2 (json):
```json
{
  "task": "build",
  "args": ["--verbose"]
}
```

Example 3 (json):
```json
{
  "mcpServers": {
    "mise": {
      "command": "mise",
      "args": ["mcp"],
      "env": {
        "MISE_EXPERIMENTAL": "1"
      }
    }
  }
}
```

---

## Settings | mise-en-place

**URL:** https://mise.jdx.dev/configuration/settings.html

**Contents:**
- Settings ​
- activate_aggressive
- all_compile
- always_keep_download
- always_keep_install
- arch
- auto_env
- auto_install
- auto_install_disable_tools
- cache_prune_age

The following is a list of all of mise's settings. These can be set via mise settings key=value, by directly modifying the global config file (~/.config/mise/config.toml) or local config, or via environment variables.

Some of them also can be set via global CLI flags.

Pushes tools' bin-paths to the front of PATH instead of allowing modifications of PATH after activation to take precedence. For example, if you have the following in your mise.toml:

But you also have this in your ~/.zshrc:

What will happen is /some/other/python will be used instead of the python installed by mise. This means you typically want to put mise activate at the end of your shell config so nothing overrides it.

If you want to always use the mise versions of tools despite what is in your shell config, set this to true. In that case, using this example again, /some/other/python will be after mise's python in PATH.

Default: false unless running NixOS or Alpine (let me know if others should be added)

Do not use precompiled binaries for all languages. Useful if running on a Linux distribution like Alpine that does not use glibc and therefore likely won't be able to run precompiled binaries.

Note that this needs to be setup for each language. File a ticket if you notice a language that is not working with this config.

Keeps downloaded archive/source files under ~/.local/share/mise/downloads after install/uninstall so you can inspect them while debugging backend/plugin install behavior.

This is not a supported download cache. Some backends may skip a download when the expected file already exists, but that behavior is backend-specific and not guaranteed. Cache ~/.local/share/mise/installs instead if you want to avoid reinstalling tools in CI or offline workflows.

should mise keep install files after installation even if the installation fails

Architecture to use for precompiled binaries. This is used to determine which precompiled binaries to download. If unset, mise will use the system's architecture.

When enabled, mise treats the following as active config environments (in addition to any explicit MISE_ENV): unix (on unix-family platforms), the OS name (linux/macos/windows), and {os}-{arch} (e.g. macos-arm64, windows-x64, using mise's remapped arch names: x86_64 -> x64, aarch64 -> arm64).

This causes config files such as mise.windows.toml, mise/config.macos-arm64.toml, or mise.unix.toml to be loaded automatically, and matching mise.<env>.lock lockfiles to be selected. Platform environments have lower precedence than explicit MISE_ENV entries; the full precedence order is unix < {os} < {os}-{arch} < explicit MISE_ENV entries. Platform environments do not affect the {{ mise_env }} template variable or the MISE_ENV variable passed to subprocesses.

When unset, this currently defaults to false. Starting with mise 2027.6.0 it will default to true; set it to false to keep the old behavior, or true to adopt the new behavior early.

This is an early-init setting: it must be set in .miserc.toml or via the MISE_AUTO_ENV environment variable. Setting it in mise.toml will have no effect because config file discovery has already occurred by the time mise.toml is read.

See Configuration Environments for more details.

Automatically install missing tools when running mise x, mise run, or as part of the 'not found' handler.

List of tools to skip automatically installing when running mise x, mise run, or as part of the 'not found' handler.

The age of the cache before it is considered stale. mise will occasionally delete cache files which have not been accessed in this amount of time.

Set to 0s to keep cache files indefinitely.

Directories where mise stops searching for config files. By default, mise will search from the current directory up to the root of the filesystem.

Setting this to a list of directories will stop the search when one of those directories is reached. Config files in the ceiling directory itself are excluded—only directories below it are searched. For example, if MISE_CEILING_PATHS="/home/user", then /home/user/mise.toml is not loaded, but /home/user/projects/myapp/mise.toml is.

This follows the same semantics as Git's GIT_CEILING_DIRECTORIES.

This is an early-init setting: it must be set in .miserc.toml, environment variables, or CLI flags. Setting it in mise.toml will have no effect because config file discovery has already occurred by the time mise.toml is read.

Paths are separated by the OS path separator when using the environment variable (: on Unix, ; on Windows).

Use color in mise terminal output

Sets the color theme for interactive prompts like mise run task selection. Available themes:

default is an alias for auto: when left unset (or set to auto/default), mise auto-detects a light terminal background via COLORFGBG and switches to base16 for readability. Set an explicit theme (e.g. charm) to disable auto-detection.

When colors are disabled (color=false, NO_COLOR, or CLICOLOR=0), interactive prompts are rendered without any styling regardless of this setting.

The default config filename read. mise use and other commands that create new config files will use this value. This must be an env var.

The default .tool-versions filename read. This will not ignore .tool-versions—use override_tool_versions_filename for that. This must be an env var.

Backends to disable for new installs, such as asdf, pipx, or a vfox-backend plugin name. This does not uninstall or disable tools already installed with those backends.

Disable the default mapping of short tool names like php -> asdf:mise-plugins/asdf-php. This parameter disables only for the backends vfox and asdf.

Turns off helpful hints when using different mise features

Tools defined in mise.toml that should be ignored

When unset, all tools are enabled unless they appear in disable_tools.

When explicitly set, this is the complete allowlist and disable_tools is not applied. Setting this to [] or MISE_ENABLE_TOOLS= disables all tools.

Enables profile-specific config files such as .mise.development.toml. Use this for different env vars or different tool versions in development/staging/production environments. See Configuration Environments for more on how to use this feature.

Multiple envs can be set by separating them with a comma, e.g. MISE_ENV=ci,test. They will be read in order, with the last one taking precedence.

This is an early-init setting: it must be set in .miserc.toml, environment variables, or CLI flags (-E/--env). Setting it in mise.toml will have no effect because MISE_ENV determines which config files to load.

When enabled, mise will cache the computed environment (env vars and PATH) to disk. This dramatically speeds up nested mise invocations (e.g., mise x -- mise env).

The cache is encrypted using a session-scoped key (__MISE_ENV_CACHE_KEY) that is generated when you run mise activate or mise exec. This means:

Cache invalidation happens when:

Modules (vfox plugins) can declare themselves cacheable by returning {cacheable = true, watch_files = [...], env = [...]} from their mise_env hook. Modules that don't declare cacheability are treated as dynamic and will be re-executed on each cache hit.

Directives can opt out of caching by setting cacheable = false:

How long cached environments remain valid before being regenerated. Accepts duration strings like "1h", "30m", "1d".

Even with a valid TTL, caches are still invalidated when config files, tool versions, settings, or watched files change.

Path to a file containing environment variables to automatically load.

Controls shell-style variable expansion in mise.toml [env] values:

Expansion happens after Tera template rendering, so both syntaxes can be mixed. Undefined variables are left unexpanded (e.g., $MISSING stays as $MISSING) and produce a warning. Use ${MISSING:-} to suppress the warning.

Automatically install missing tools when running mise x.

Enables experimental features. I generally will publish new features under this config which needs to be enabled to use them. While a feature is marked as "experimental" its behavior may change or even disappear in any release.

The idea is experimental features can be iterated on this way so we can get the behavior right, but once that label goes away you shouldn't expect things to change without a proper deprecation—and even then it's unlikely.

Also, I very often will use experimental as a beta flag as well. New functionality that I want to test with a smaller subset of users I will often push out under experimental mode even if it's not related to an experimental feature.

If you'd like to help me out, consider enabling it even if you don't have a particular feature you'd like to try. Also, if something isn't working right, try disabling it if you can.

duration that remote version cache is kept for "fast" commands (represented by PREFER_STALE), these are always cached. For "slow" commands like mise ls-remote or mise install:

Timeout in seconds for HTTP requests to fetch new tool versions in mise.

Enable/disable GitHub Artifact Attestations verification globally. When enabled, mise will verify the authenticity and integrity of downloaded tools using GitHub's artifact attestation system for tools that support it (e.g., Ruby precompiled binaries).

Path to the global mise config file. Default is ~/.config/mise/config.toml. This must be an env var.

Path which is used as {{config_root}} for the global config file. Default is $HOME. This must be an env var.

Use gpg to verify all tool signatures.

Retries are attempted only on transient errors: HTTP 5xx (server errors), 408 (Request Timeout), 429 (Too Many Requests), and network-layer failures (connect refused, timeout, mid-stream body drops). Other 4xx responses (e.g. 404) are treated as permanent and not retried.

Backoff schedule with jitter: ~200ms / ~1s / ~4s / ~15s. Set to 0 to disable retries entirely.

When a retry rescues a request, a warning is logged with the original error so flaky infrastructure doesn't silently mask itself.

Timeout in seconds for all HTTP requests in mise.

By default, idiomatic version files are disabled. You can enable them for specific tools with this setting.

For example, to enable idiomatic version files for node and python:

See Idiomatic Version Files for more information.

This is a list of config paths that mise will ignore.

This is an early-init setting: it must be set in .miserc.toml, environment variables, or CLI flags. Setting it in mise.toml will have no effect because config file discovery has already occurred by the time mise.toml is read.

Paths are separated by the OS path separator when using the environment variable (: on Unix, ; on Windows).

How many jobs to run concurrently such as tool installs.

Libc implementation to use for precompiled Linux binaries. This is used by backends that publish separate glibc and musl builds. If unset, mise will detect the current system's libc.

gnu is accepted as an alias for glibc.

[!NOTE] This setting requires lockfile to be enabled.

When enabled, mise install will fail if tools don't have pre-resolved URLs in the lockfile for the current platform. This prevents API calls to GitHub, aqua registry, etc. and ensures reproducible installations.

This is useful in CI/CD environments where you want to:

To generate lockfile URLs, run:

Equivalent to passing --locked to mise install.

When enabled, mise install will re-verify provenance (SLSA, cosign, minisign, GitHub artifact attestations) at install time even when the lockfile already contains both a checksum and a provenance entry.

By default, when a lockfile has a checksum and provenance type recorded, mise install trusts the lockfile and skips re-verification to avoid redundant API calls (e.g., to GitHub). Enabling this setting forces re-verification every time, which provides stronger security guarantees at the cost of additional network requests.

This is automatically enabled when paranoid is set to true.

Read/update lockfiles for tool versions. This is useful when you'd like to have loose versions in mise.toml like this:

But you'd like the versions installed to be consistent within a project. When this is enabled, mise will update mise.lock files next to mise.toml files containing pinned versions. When installing tools, mise will reference this lockfile if it exists and this setting is enabled to resolve versions.

The lockfiles are not created automatically. To generate them, run the following (assuming the config file is mise.toml):

The lockfile is named the same as the config file but with .lock instead of .toml as the extension, e.g.:

When set to true, lockfiles are read and written. When set to false, lockfiles are explicitly disabled—this will cause an error if locked = true is also set, since locked mode requires reading lockfiles. When unset (the default), lockfiles are enabled (same as true) but there is no conflict with locked mode.

Restricts which platforms are included when auto-locking (triggered by mise install/mise use) or when running mise lock without --platform. By default (unset), mise targets all common platforms (linux-x64, linux-x64-musl, linux-arm64, linux-arm64-musl, macos-x64, macos-arm64, windows-x64) plus the current platform.

Setting this avoids resolving checksums/URLs for platforms you don't need, keeping lockfiles smaller and mise install/mise use faster.

Does NOT override explicit mise lock --platform flags.

The current platform is always included in addition to any configured platforms.

Platform format: os-arch or os-arch-qualifier (e.g., linux-x64, linux-x64-musl, macos-arm64).

Filter tool versions by release date to limit supply chain risk. Similar to Renovate's minimum release age, this ensures newly published versions are ignored until they've been available for a configurable amount of time — giving the community time to discover compromised releases. This name matches pnpm's minimumReleaseAge setting, though mise accepts both relative durations and absolute cutoff dates.

Capability depends on what each backend can report or pass through:

Behavior: For most backends, this filter only applies when resolving fuzzy version requests like node@20 or latest. Explicitly pinned versions like node@22.5.0 are not filtered, allowing you to selectively use newer versions for specific tools while keeping others behind the cutoff date.

For npm: and pipx: package-manager support details, see the backend docs.

Defaults to 24h. Set minimum_release_age = "0s" to effectively disable the delay.

Can be overridden with the --minimum-release-age CLI flag or per-tool with the minimum_release_age tool option.

Exclude tools or backends from the global/default minimum_release_age setting. This is useful for tools where newly published releases are time-sensitive.

Exclusions match any of:

This excludes matching tools from the global setting and built-in default. A per-tool minimum_release_age option or the --minimum-release-age CLI flag still applies to matching tools.

When enabled, mise will read credentials from the netrc file and apply HTTP Basic authentication for matching hosts. This is useful for accessing private artifact repositories like Artifactory or Nexus.

On Unix/macOS, the default path is ~/.netrc. On Windows, mise looks for %USERPROFILE%\_netrc first, then falls back to %USERPROFILE%\.netrc.

The netrc file format is:

You can also specify a custom netrc file path using the netrc_file setting.

Override the default netrc file path. This is useful if you want to use a different netrc file for mise or if your netrc file is in a non-standard location.

Do not load environment variables from config files.

Do not execute hooks from config files.

Set to false to disable the "command not found" handler to autoinstall missing tool versions. Disable this if experiencing strange behavior in your shell when a command is not found.

Important limitation: This handler only installs missing versions of tools that already have at least one version installed. mise cannot determine which tool provides a binary without having the tool installed first, so it cannot auto-install completely new tools.

This also runs in shims if the terminal is interactive.

When enabled, mise will never make HTTP requests. This is useful for air-gapped environments, VPN issues, or when you want to ensure mise only uses locally cached data.

Note: Commands like hook-env, activate, exec, env, and shims already avoid most network requests via the prefer_offline behavior. Set offline = true to completely block all HTTP requests for commands like mise install or mise ls-remote as well.

Can also be set with the --offline CLI flag.

OS to use for precompiled binaries.

If set, mise will ignore default config files like mise.toml and use these filenames instead.

This is an early-init setting: it must be set in .miserc.toml, environment variables, or CLI flags. Setting it in mise.toml will have no effect because config file discovery has already occurred by the time mise.toml is read.

If set, mise will ignore .tool-versions files and use these filenames instead. Can be set to none to disable .tool-versions entirely.

This is an early-init setting: it must be set in .miserc.toml, environment variables, or CLI flags. Setting it in mise.toml will have no effect because config file discovery has already occurred by the time mise.toml is read.

Enables extra-secure behavior. See Paranoid.

This sets --pin by default when running mise use in mise.toml files. This can be overridden by passing --fuzzy on the command line.

How long to wait before updating plugins automatically (note this isn't currently implemented).

When enabled, mise will prefer locally cached data and avoid remote version fetching when possible. Unlike offline, this still allows network requests as a fallback.

This is automatically enabled for fast commands like hook-env, activate, exec, env, ls, current, where, which, and shims.

By default, releases flagged prerelease: true on GitHub/Forgejo are excluded from mise ls-remote, latest resolution, and fuzzy version matching. Per-tool opt-in is available via the prerelease = true tool option (currently honored by the github:, forgejo:, aqua:, and dotnet: backends).

Set prereleases = true (or MISE_PRERELEASES=1) to opt in globally for every tool — equivalent to setting prerelease = true on each one. Useful for build pipelines that mirror the full release catalog (e.g. https://github.com/jdx/mise-versions) and for users who want pre-release tags to surface in mise ls-remote without per-tool config.

Can also be set with the --prerelease flag on mise ls-remote.

Has no effect on backends that don't carry an upstream pre-release flag (e.g. github_tag version source). Draft releases are always excluded.

When enabled, mise treats provenance API failures as install errors. This keeps provenance strict by default: if a remote attestation or release-provenance API cannot be reached or queried, mise will fail instead of silently installing without provenance.

Set this to false to warn and continue when provenance API checks fail. This does not ignore checksum failures, provenance verification mismatches, or lockfiles that already require provenance for the tool being installed.

Suppress all output except errors.

Connect stdin/stdout/stderr to child processes.

A list of additional directories to search for installed tool versions. These directories are checked after the primary install directory (~/.local/share/mise/installs) when looking for installed tools. They are read-only—mise will never install tools into these directories.

The system directory /usr/local/share/mise/installs (or MISE_SYSTEM_DATA_DIR/installs) is always checked automatically when it exists—you do not need to add it here. To populate it, run: mise install --system node@20

This is useful for shared environments like Docker containers or bastion hosts where a base set of tools is pre-installed in a shared location, and users can install additional tools in their own directory.

Paths are separated by the OS path separator when using the environment variable (: on Unix, ; on Windows).

Suppress all mise run|watch output except errors—including what tasks output.

Enable/disable SLSA provenance verification globally for all backends that support it. When enabled, mise will verify the supply-chain integrity of downloaded tools using SLSA provenance attestations.

Path to the system mise config file. Default is /etc/mise/config.toml. This must be an env var.

Enable terminal progress indicators using OSC 9;4 escape sequences. This provides native progress bars in the terminal window chrome for terminals that support it, including Ghostty, iTerm2, VS Code's integrated terminal, Windows Terminal, and VTE-based terminals (GNOME Terminal, Ptyxis, etc.).

When enabled, mise will send progress updates to the terminal during operations like tool installations. The progress bar appears in the terminal's window UI, separate from the text output.

mise automatically detects whether your terminal supports OSC 9;4 and will only send these sequences if supported. Terminals like Alacritty, WezTerm, and kitty do not support OSC 9;4 and will not receive these sequences.

Set to false to disable this feature if you prefer not to see these indicators.

This is a list of config paths that mise will automatically mark as trusted. Any config files under these paths will be trusted without prompting. Set to ["/"] to trust all config files, effectively disabling the trust mechanism. Paths are separated by the OS path separator when using the environment variable (: on Unix, ; on Windows).

Default shell arguments for Unix to be used for file commands. For example, sh for sh.

Default shell arguments for Unix to be used for inline commands. For example, sh -c for sh.

Map of URL patterns to replacement URLs. This feature supports both simple hostname replacements and advanced regex-based URL transformations for download mirroring and custom registries.

See URL Replacements for more information.

Determines whether to use a specified shell for executing tasks in the tasks directory. When set to true, the shell defined in the file will be used, or the default shell specified by windows_default_file_shell_args or unix_default_file_shell_args will be applied. If set to false, tasks will be executed directly as programs.

Set to "false" to disable using mise-versions as a shared cache for version lists, public GitHub release metadata, and GitHub artifact attestations.

This host regularly grabs all the latest versions of core and community plugins. It's faster than running a plugin's list-all command and gets around GitHub rate limiting problems when using it. For tools distributed through public GitHub releases, mise also uses this host before calling GitHub's releases and artifact attestation APIs directly. This avoids the anonymous GitHub API rate limit in normal installs, including Docker builds and CI jobs that do not have a GitHub token configured.

If the versions host does not have the requested metadata yet, mise falls back to GitHub's API. Private repositories, GitHub Enterprise, custom GitHub API URLs, and users who disable this setting still need normal GitHub authentication when they would otherwise exceed GitHub's rate limits.

mise-versions itself also struggles with rate limits but you can help it to fetch more frequently by authenticating with its GitHub app. It does not require any permissions since it simply fetches public repository information.

See Troubleshooting for more information.

When enabled, mise sends anonymous download statistics to mise-versions.jdx.dev after successfully installing a tool. This helps show tool popularity on mise-versions.jdx.dev.

This is automatically disabled if use_versions_host is set to false. Set to false to opt-out of anonymous statistics collection.

Shows more verbose output such as installation logs when installing tools.

Default shell arguments for Windows to be used for file commands. For example, cmd /c for cmd.exe.

Default shell arguments for Windows to be used for inline commands. For example, cmd /c for cmd.exe.

List of executable extensions for Windows. For example, exe for .exe files, bat for .bat files, and so on.

This will automatically answer yes or no to prompts. This is useful for scripting.

[experimental] List of age identity files to use for decryption.

[experimental] Path to the age private key file to use for encryption/decryption.

[experimental] List of SSH identity files to use for age decryption.

If true, fail when age decryption fails (including when age is not available, the key is missing, or the key is invalid). If false, skip decryption and continue in these cases.

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

If true, mise will use cargo binstall instead of cargo install if cargo-binstall is installed and on PATH. This makes installing CLIs with cargo much faster by downloading precompiled binaries.

When cargo-binstall installs a prebuilt binary, Cargo build settings and cargo install behavior do not affect the downloaded artifact. Set cargo.binstall = false to force cargo install when you need Cargo settings to control the install.

When mise invokes cargo-binstall, cargo-binstall handles its own fallback order, including its final fallback to compiling with cargo install. mise does not retry with a separate cargo install command if cargo-binstall exits with an error.

You can install it with mise:

Only use cargo-binstall for installation, fail if not available.

Packages are installed from the official cargo registry.

You can set this to a different registry name if you have a custom feed or want to use a different source.

Please follow the cargo alternative registries documentation to configure your registry.

Default conda channel when installing packages with the conda backend. Override per-package with conda:package[channel=bioconda].

The most common channels are:

Default mode for dotfile entries when mode is omitted. Options: symlink, symlink-each, copy, template.

Root directory used for implied dotfile sources.

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

If true, compile erlang from source. If false, use precompiled binaries. If not set, use precompiled binaries if available.

When set, mise executes this command via sh -c and reads the token from stdout. The hostname is exposed as MISE_CREDENTIAL_HOST, making the command host-aware for self-hosted Forgejo environments. This replaces the git credential fill fallback and does not require forgejo.use_git_credentials to be enabled.

The command should print a single token to stdout. Trailing whitespace is trimmed.

Example: op read "op://Private/Forgejo Token/credential"

When enabled, mise will read tokens from the fj CLI keys file (~/.local/share/forgejo-cli/keys.json on Linux, ~/Library/Application Support/Cyborus.forgejo-cli/keys.json on macOS). This is used as a fallback when no FORGEJO_TOKEN or MISE_FORGEJO_TOKEN environment variable is set.

Set to false to disable this behavior.

When enabled, mise will run git credential fill to obtain Forgejo tokens using the credential helpers configured in your .gitconfig.

This covers tokens stored in system keyrings (macOS Keychain, Windows Credential Manager), and any other git credential helper.

Used as a last resort — after environment variables, forgejo_tokens.toml, and fj CLI tokens are checked. Results are cached per host for the duration of the session.

Set to true to enable this behavior.

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

When set, mise executes this command via sh -c and reads the token from stdout. The hostname is exposed as MISE_CREDENTIAL_HOST, making the command host-aware for self-managed GitLab environments. This replaces the git credential fill fallback and does not require gitlab.use_git_credentials to be enabled.

The command should print a single token to stdout. Trailing whitespace is trimmed.

Example: op read "op://Private/GitLab Token/credential"

When enabled, mise will read tokens from the glab CLI config file (~/.config/glab-cli/config.yml or $GLAB_CONFIG_DIR/config.yml) as a fallback when no GITLAB_TOKEN or MISE_GITLAB_TOKEN environment variable is set.

Set to false to disable this behavior.

When enabled, mise will run git credential fill to obtain GitLab tokens using the credential helpers configured in your .gitconfig.

This covers tokens stored in system keyrings (macOS Keychain, Windows Credential Manager), and any other git credential helper.

Used as a last resort — after environment variables, gitlab_tokens.toml, and glab CLI tokens are checked. Results are cached per host for the duration of the session.

Set to true to enable this behavior.

Path to a file containing default go packages to install when installing go.

Mirror to download go sdk tarballs from.

URL to fetch go from.

Defaults to ~/.local/share/mise/installs/go/.../bin. Set to true to override GOBIN if previously set. Set to false to not set GOBIN (default is ${GOPATH:-$HOME/go}/bin).

[deprecated] Set to true to set GOPATH=~/.local/share/mise/installs/go/.../packages.

Sets GOROOT=~/.local/share/mise/installs/go/.../.

Set to true to skip checksum verification when downloading go sdk tarballs.

On slow filesystems (like NFS with cold cache), mise's hook-env can be slow due to multiple filesystem stat operations. Setting this to a positive value (e.g., "5s") will cache the results of directory traversal and only re-check after the TTL expires.

When set to "0s" (default), no caching is performed and every hook-env call will check the filesystem for changes. This is the safest option but slowest on NFS.

Note: When caching is enabled, newly created config files may not be detected until the TTL expires. Use mise hook-env --force to bypass the cache.

When enabled, mise will only perform full config file checks when the directory changes (chpwd), not on every shell prompt (precmd). This significantly reduces filesystem operations on slow filesystems like NFS.

With this enabled, changes to config files will not be detected until you change directories. Use mise hook-env --force to manually trigger a full update.

This setting is useful when:

Shorthand for Java. Used when installing Java without a vendor prefix.

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

Package manager to use for installing npm packages. The default, auto, uses aube when it is installed and falls back to npm, similar to how the pipx backend uses uv when available. Set this to npm, aube, bun, or pnpm to force a specific package manager.

Default base image reference used by mise oci build when the mise.toml does not set [oci].from and --from is not passed on the CLI. Must be a glibc-based image for most mise tool installs (Node, Python, Ruby prebuilt binaries) to work.

Alpine-based images are not recommended because their musl libc breaks glibc-linked prebuilt binaries that most tools ship.

Path inside the built image where mise tool installs and shims are placed. Defaults to /mise. The resulting image sets MISE_DATA_DIR to this path.

URL to use for pipx registry.

This is used to fetch the latest version of a package from the pypi registry.

The default is https://pypi.org/pypi/{}/json which is the JSON endpoint for the pypi registry.

You can also use the HTML endpoint by setting this to https://pypi.org/simple/{}/.

If true, mise will use uvx instead of pipx if uv is installed and on PATH. This makes installing CLIs much faster by using uv as the package manager.

You can install it with mise:

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

Path to the cargo home directory. Defaults to ~/.cargo or %USERPROFILE%\.cargo

Default host triple to pass to rustup init via --default-host.

Path to the rustup home directory. Defaults to ~/.rustup or %USERPROFILE%\.rustup

The age private key to use for sops secret decryption. Takes precedence over standard SOPS_AGE_KEY environment variable.

Path to the age private key file for sops secret decryption. Takes precedence over standard SOPS_AGE_KEY_FILE environment variable.

The age public keys to use for sops secret encryption.

Use rops to decrypt sops files. Disable to shell out to sops which will slow down mise but sops may offer features not available in rops. Required for TOML SOPS files because the sops CLI does not support TOML.

If true, fail when sops decryption fails (including when sops is not available, the key is missing, or the key is invalid). If false, skip decryption and continue in these cases.

Only use SwiftPM artifact bundles for installation, fail if no matching bundle is available.

Show a warning if tools are not installed when entering a directory with a mise.toml file.

Disable tools with disable_tools.

Show warning when deps providers have stale dependencies.

Show configured env vars when entering a directory with a mise.toml file.

Show configured tools when entering a directory with a mise.toml file.

Truncate status messages.

Use gpg to verify swift tool signatures.

Override the platform to use for precompiled binaries.

[experimental] Restrict which system package managers mise will use.

By default mise acts on every manager in [bootstrap.packages] that is available on the current machine. When more than one could apply (e.g. several package managers installed on one machine, or a shared config listing managers you don't want on this machine), set this to the subset you want:

This composes well with platform-specific config files (mise.macos.toml, mise.linux.toml) for per-OS defaults.

[experimental] Allow mise bootstrap packages apply to elevate with sudo when not running as root.

When disabled, mise never runs sudo: if elevation would be required, it errors with the exact command to run manually. mise only elevates for explicit mise bootstrap packages apply invocations, logs the full command line before running it, and skips sudo entirely when already running as root (e.g. containers/CI).

Paths that mise will not look for tasks in.

Paths are separated by the OS path separator when using the environment variable (: on Unix, ; on Windows).

When enabled, arg(), option(), and flag() Tera functions in run scripts will not contribute to the task's usage spec—only the explicit usage field is used.

When using monorepo mode (monorepo_root = true), this controls how deep mise will search for task files in subdirectories.

Performance tip: Reduce this value if you have a very large monorepo and notice slow task discovery. For example, if your projects are all at projects/*, set to 2.

Or via environment variable:

If empty (default), uses default exclusions: node_modules, target, dist, build. If you specify any patterns, ONLY those patterns will be excluded (defaults are NOT included). For example, setting to [".temp", "vendor"] will exclude only those two directories.

When enabled, mise will skip directories that are ignored by .gitignore files when discovering tasks in a monorepo.

Change output style when executing tasks. This controls the output of mise run.

Mise will always fetch the latest tasks from the remote, by default the cache is used.

Automatically install missing tools when executing tasks.

Disable truncation of command lines in task execution output. When true, the full command line will be shown.

Tasks to skip when running mise run.

Run only specified tasks skipping all dependencies.

When source mtime equals output mtime, consider sources fresh (use <=). Default false uses strict < comparison.

Use content hashing (blake3) instead of metadata for source freshness. More accurate but slower.

Sets a global default timeout for all tasks. Individual tasks can also specify their own timeout.

When both a global timeout and a per-task timeout are set, the shorter of the two always wins—a per-task timeout cannot extend beyond the global timeout. The --timeout CLI flag overrides this global setting.

Show completion message with elapsed time for each task on mise run. Default shows when output type is prefix.

This setting allows mise to fetch Zig from one of many community-maintained mirrors.

The ziglang.org website does not offer any uptime or speed guarantees, and it recommends to use the mirrors. The mirror list is cached and allows the installs to succeed even if the main server is unavailable.

The downloaded tarballs are always verified against Zig Software Foundation's public key, so there is no risk of third-party modifications. Read more on ziglang.org.

If you don't have the mirror list cached locally, you can place the newline-separated server list inside mise cache path, folder zig as community-mirrors.txt.

**Examples:**

Example 1 (json):
```json
[tools]
node = '20'
python = '3.12'
```

Example 2 (bash):
```bash
eval "$(mise activate zsh)"
PATH="/some/other/python:$PATH"
```

Example 3 (json):
```json
[env]
TIMESTAMP = { value = "{{ now() }}", cacheable = false }
_.source = { file = "dynamic.sh", cacheable = false }
```

Example 4 (css):
```css
[env]
FOO = "hello"
BAR = "$FOO-world"        # "hello-world"
BAZ = "${FOO}_suffix"     # "hello_suffix"
QUX = "${UNDEF:-fallback}" # "fallback"
```

---

## Registry | mise-en-place

**URL:** https://mise.jdx.dev/registry.html

**Contents:**
- Registry ​
- Backends ​
  - Backends Priority ​
  - Environment Variable Overrides ​
- Tools ​

List of all tools aliased by default in mise.

You can use these shorthands with mise use. This allows you to use a tool without needing to know the full name. For example, to use the aws-cli tool, you can do the following:

If a tool is not available in the registry, you can install it by its full name. github and aqua give you for example access to almost all programs available on GitHub.

In addition to built-in core tools, mise supports a variety of backends to install tools.

Backends fall into the following acceptance tiers for new registry entries:

Tier 1 — preferred, routinely accepted:

Tier 2 — high bar, but lower than tier 3:

Tier 3 — very high bar, rarely accepted:

These all depend on a separately-installed runtime/toolchain on PATH, which is fragile — npm/pipx/gem in particular silently bind tools to whichever node/python/ruby happened to be on PATH at install time.

Users can still install via any backend themselves with explicit syntax (mise use vfox:owner/repo, mise use cargo:name, etc.) — they just don't get a registry shorthand for it.

Each tool can define its own priority if it has more than one backend it supports. If you would like to disable a backend, you can do so with the following command:

This will disable the asdf backend. See Aliases for a way to set a default backend for a tool. Note that the asdf backend is disabled by default on Windows.

You can also specify the full name for a tool using mise use aqua:1password/cli if you want to use a specific backend.

You can override the backend for any tool using environment variables with the pattern MISE_BACKENDS_<TOOL>. This takes the highest priority and overrides any registry or alias configuration:

The tool name in the environment variable should be in SHOUTY_SNAKE_CASE (uppercase with underscores). For example, my-tool becomes MISE_BACKENDS_MY_TOOL.

Source: https://github.com/jdx/mise/blob/main/registry/

Note that mise registry can be used to list all tools in the registry. mise use without any arguments will show a tui to select a tool to install.

**Examples:**

Example 1 (elixir):
```elixir
mise use aws-cli
```

Example 2 (elixir):
```elixir
mise use aqua:aws/aws-cli
```

Example 3 (sass):
```sass
mise settings disable_backends=asdf
```

Example 4 (elixir):
```elixir
# Use vfox backend for php
export MISE_BACKENDS_PHP='vfox:mise-plugins/vfox-php'
mise install php@latest
```

---

## Getting Started | mise-en-place

**URL:** https://mise.jdx.dev/getting-started.html

**Contents:**
- Getting Started ​
- 1. Install mise CLI ​
- 2. mise exec and run ​
- 3. Activate mise optional ​
  - Shell Feature Compatibility ​
- 4. Use tools from backends (npm, pipx, core, aqua, github) ​
- Trusting config files ​
- 5. Setting environment variables ​
- 6. Run a task ​
- 7. Next steps ​

Get up and running with mise in minutes.

See installing mise for other ways to install mise (macport, apt, yum, nix, etc.).

By default, mise installs to ~/.local/bin, but it can go anywhere.

Verify the installation:

mise respects MISE_DATA_DIR and XDG_DATA_HOME if you'd like to change these locations.

Once installed, you can start using mise right away to install and run tools, launch tasks, and manage environment variables.

The quickest way to run a tool at a specific version is mise x|exec. For example, to launch a Python 3 REPL:

If mise isn't on PATH yet, use ~/.local/bin/mise instead.

To install a tool permanently, use mise u|use:

mise r|run lets you run tasks or scripts with the full mise context (tools + env vars) loaded.

You can set a shell alias in your shell's rc file like alias x="mise x --" to save some keystrokes.

mise exec works great for one-off commands, but for interactive shells you'll probably want to activate mise so tools and environment variables are loaded automatically.

There are two approaches:

You can also skip both and call mise exec or mise run directly. See this guide for more information.

Here is how to activate mise for your shell:

Restart your shell session after modifying your rc file. Run mise dr|doctor to verify everything is set up correctly.

With mise activated, tools are available directly on PATH:

When you ran mise use --global node@26, mise updated your global config:

Not all shells support every mise feature:

Backends are the package ecosystems that mise pulls tools from. With mise use, you can install from any of them.

Install claude-code from npm:

Install black from PyPI via pipx:

Install ripgrep directly from GitHub releases:

Each mise use command above updates your config file. For example, after running all three globally, your ~/.config/mise/config.toml would contain:

You can also edit mise.toml directly instead of using mise use — the effect is the same. Run mise install after editing to install the tools.

See Backends for more ecosystems and details.

When you or a teammate adds a mise.toml to a project, mise will prompt you to trust it before it runs any env directives or hooks:

This is a security measure — config files can execute arbitrary code via [env] directives, hooks, and tasks. To trust a file, run:

This only needs to be done once per file. See mise trust for more details.

To disable trust prompts entirely, trust the root path:

Or set the environment variable MISE_TRUSTED_CONFIG_PATHS=/.

mise use automatically trusts the file it creates, so you'll only see this prompt when pulling a config someone else wrote or when editing mise.toml by hand.

Define environment variables in mise.toml — they'll be loaded whenever mise is activated or when using mise exec:

Define tasks in mise.toml and run them with mise run:

mise automatically installs all tools from mise.toml before running a task.

See tasks for more on defining and running tasks.

Follow the walkthrough for more examples on how to use mise.

See autocompletion to learn how to set up autocompletion for your shell.

Many tools in mise require the GitHub API. Unauthenticated requests are often rate limited — if you see 4xx errors, see GitHub Tokens for how to configure authentication.

**Examples:**

Example 1 (unknown):
```unknown
curl https://mise.run | sh
```

Example 2 (markdown):
```markdown
~/.local/bin/mise --version
# mise 2024.x.x
```

Example 3 (lua):
```lua
mise exec python@3 -- python
# this will download and install Python if it is not already installed
# Python 3.15.0
# >>> ...
```

Example 4 (elixir):
```elixir
mise exec node@26 -- node -v
# v26.x.x
```

---

## Mise + C++ Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/cpp.html

**Contents:**
- Mise + C++ Cookbook ​
- A C++ Project with CMake ​

Here are some tips on managing C++ projects with mise.

**Examples:**

Example 1 (bash):
```bash
min_version = "2024.9.5"

[env]
# Project information
PROJECT_NAME = "{{ config_root | basename }}"

# Build directory
BUILD_DIR = "{{ config_root }}/build"

[tools]
# Install CMake and make
cmake = "latest"
make = "latest"

[tasks.configure]
description = "Configure the project"
run = "mkdir -p $BUILD_DIR && cd $BUILD_DIR && cmake .."

[tasks.build]
description = "Build the project"
alias = "b"
run = "cd $BUILD_DIR && make"

[tasks.clean]
description = "Clean the build directory"
alias = "c"
run = "rm -rf $BUILD_DIR"

[tasks.run]
alias = "r"
description = "Run the application"
run = "$BUILD_DIR/bin/$PROJECT_NAME"

[tasks.info]
description = "Print project information"
run = '''
echo "Project: $PROJECT_NAME"
echo "Build Directory: $BUILD_DIR"
'''
```

---

## URL Replacements | mise-en-place

**URL:** https://mise.jdx.dev/url-replacements.html

**Contents:**
- URL Replacements ​
- Configuration Examples ​
- Simple Hostname Replacement ​
- Advanced Regex Replacement ​
  - Regex Examples ​
    - 1. Protocol Conversion (HTTP to HTTPS) ​
    - 2. GitHub Release Mirroring with Path Restructuring ​
    - 3. Subdomain to Path Conversion ​
    - 4. Multiple Replacement Patterns (processed in order) ​
- Use Cases ​

mise does not include a built-in registry for downloading artifacts. Instead, it retrieves remote registry manifests, which specify the URLs for downloading tools.

In some environments — such as enterprises or DMZs — these URLs may not be directly accessible and must be accessed through a proxy or internal mirror.

URL replacements allow you to modify or redirect any URL that mise attempts to access, making it possible to use internal proxies, mirrors, or alternative sources as needed.

In mise.toml (single line):

In mise.toml (multiline):

For simple hostname-based mirroring, the key is the original hostname/domain to replace, and the value is the replacement string. The replacement happens by searching and replacing the pattern anywhere in the full URL string (including protocol, hostname, path, and query parameters).

See Security Considerations for important warnings about credential handling.

For more complex URL transformations, you can use regex patterns. When a key starts with regex:, it is treated as a regular expression pattern that can match and transform any part of the URL. The value can use capture groups from the regex pattern.

This converts any HTTP URL to HTTPS by capturing everything after "http://" and replacing it with "https://".

Transforms https://github.com/owner/repo/releases/download/v1.0.0/file.tar.gz to https://hub.example.com/artifactory/github/owner/repo/v1.0.0/file.tar.gz

Converts subdomain-based URLs to path-based URLs on a unified CDN.

First regex catches Microsoft repositories specifically, second catches all other GitHub URLs, and the simple replacement handles HashiCorp.

mise uses Rust regex engine which supports:

You can check on regex101.com if your regex works (see example). Full regex syntax documentation: https://docs.rs/regex/latest/regex/#syntax

When using regex patterns, ensure your replacement URLs point to trusted sources, as this feature can redirect tool downloads to arbitrary locations.

Credential Leaking: When using url_replacements, any authentication headers (like Authorization: Bearer <TOKEN>) generated for the original URL (e.g., api.github.com) are preserved and sent to the replaced URL.

This is by design to allow authentication with internal proxies that forward requests to upstream services (GitHub, GitLab, Forgejo, etc.). However, it means you must only replace URLs with trusted servers. Redirecting to an untrusted server will leak your credentials to that server.

Best Practice: Use the ^ anchor in your regex patterns to ensure you are matching the start of the URL.

Bad: "regex:github\\.com" (matches evil-github.com) Good: "regex:^https://github\\.com" (only matches actual GitHub URLs)

URL replacements can be used with ~/.netrc (or ~/_netrc on Windows) to authenticate with the replaced URL. Replacements are applied before the netrc lookup, so you should use the hostname of the replaced URL in your netrc file.

For example, if you have this in mise.toml:

Credentials from .netrc take precedence over and will overwrite any default authentication headers (such as those from MISE_GITHUB_TOKEN or other environment variables).

You should have this in ~/.netrc:

**Examples:**

Example 1 (json):
```json
[settings]
url_replacements = { "example.com" = "mirror.example.com" }
```

Example 2 (json):
```json
[settings.url_replacements]
"example.com" = "mirror.example.com"
"releases.hashicorp.com" = "hashicorp.example.com"
```

Example 3 (perl):
```perl
[settings.url_replacements]
"regex:^http://(.+)" = "https://$1"
"regex:^https://github\\.com/([^/]+)/([^/]+)/releases/download/(.+)" = "https://hub.example.com/artifactory/github/$1/$2/$3"
```

Example 4 (perl):
```perl
[settings]
url_replacements = {
  "regex:^http://(.+)" = "https://$1"
}
```

---

## Templates | mise-en-place

**URL:** https://mise.jdx.dev/templates.html

**Contents:**
- Templates ​
- Example ​
- Template Rendering ​
  - Tera Filters ​
  - Tera Functions ​
  - Tera Tests ​
- Mise Template Features ​
  - Variables ​
  - Functions ​
    - Tera Built-In Functions ​

Templates in mise provide a powerful way to configure different aspects of your environment and project settings.

A template is a string that contains variables, expressions, and control structures. When rendered, the template engine (tera) replaces the variables with their values.

You can define and use templates in the following locations:

Here is an example of a mise.toml file that uses templates:

You will find more examples in the cookbook.

Mise uses tera to provide the template feature. In the template, there are 3 kinds of delimiters:

Additionally, use raw block to skip rendering tera delimiters:

This will become Hello {{name}}.

Tera supports literals, including:

You can render a variable by using the {{ name }}. For complex attributes, use:

Tera also supports powerful expressions:

Tera also supports control structures such as if and for.

You can modify variables using filters. You can filter a variable by a pipe symbol (|) and may have named arguments in parentheses. You can also chain multiple filters. e.g. {{ "Doctor Who" | lower | replace(from="doctor", to="Dr.") }} will output Dr. who.

Functions provide additional features to templates.

You can also uses tests to examine variables.

Mise provides additional variables, functions, filters, and tests on top of tera features.

Mise exposes several variables. These variables offer key information about the current environment:

In task run scripts, mise also exposes a usage map when the task has a usage specification (see Task Arguments):

The keys are the argument/flag names as written in the usage spec. If the name contains -, use bracket access, e.g. {{ usage["dry-run"] }}. Examples:

Tera offers many built-in functions. [] indicates an optional function argument. Some functions:

Tera offers more functions. Read more on tera documentation.

Mise offers a slew of useful functions in addition to tera's built-ins.

These functions are available in all tasks, and will always behave the same way regardless of the task definition they are used in. In other words, their return values are consistent across task definition(s).

These functions are task-specific and behave differently depending on the task they are used in. In other words, their return values may (but are not guaranteed to) be consistent across executions of any given task, and should be expected to be inconsistent across different task definition(s).

For example, task_source_files() returns a different set of filepaths depending on the sources of the task it's called from.

The exec function supports the following options:

Tera offers many built-in filters. [] indicates an optional filter argument. Some filters:

Tera offers more filters. Read more on tera documentation.

For example, you can use split(), concat(), and join_path filters to construct a file path:

Tera offers many built-in tests. Some tests:

Tera offers more tests. Read more on tera documentation.

Mise offers additional tests:

.miserc.toml files support Tera templates, but with a limited context. This is because .miserc.toml is loaded very early — before mise.toml, Settings, and the main config are parsed — so only information available at OS level can be used.

Conditionals work too — {% if %} blocks at the top level produce empty lines when the condition is false, which TOML ignores:

If a template fails to render (e.g. due to an undefined variable), mise will log a warning and fall back to the raw content.

If your .miserc.toml values contain literal {{, {%, or {# characters (not intended as templates), wrap them in a {% raw %}...{% endraw %} block to prevent Tera from interpreting them.

**Examples:**

Example 1 (json):
```json
[env]
PROJECT_NAME = "{{ cwd | basename }}"
TERRAFORM_VERSION = "1.0.0"

[tools]
# refers to env variable defined in this file
terraform = "{{ env.TERRAFORM_VERSION }}"
# refers to external env variable
node = "{{ get_env(name='NODE_VERSION', default='20') }}"
```

Example 2 (json):
```json
{% raw %}
  Hello {{ name }}
{% endraw %}
```

Example 3 (json):
```json
{% if my_number is not odd %}
  Even
{% endif %}
```

Example 4 (json):
```json
[tasks.deploy]
usage = '''
arg "<environment>" help="Target environment"
flag "-v --verbose" help="Enable verbose output"
arg "[tags]" var=#true
'''
run = '''
echo "env={{ usage.environment }}"
echo "verbose={{ usage.verbose }}"
echo "tag count={{ usage.tags | length }}"
{% for tag in usage.tags %}
  echo "tag={{ tag }}"
{% endfor %}
'''
```

---

## Walkthrough | mise-en-place

**URL:** https://mise.jdx.dev/walkthrough.html

**Contents:**
- Walkthrough ​
- Installing Dev Tools ​
- mise.toml Configuration ​
- Dev Tool Backends ​
- Upgrading Dev Tools ​
- Setting Environment Variables ​
- Tasks ​
- Common Commands ​
- Final Thoughts ​

Once you've completed the Getting Started guide, you're ready to start using mise. This document offers a quick overview on some initial things you may want to try out.

The main command for working with tools in mise is mise u|use. This does 2 main things:

Both of these are required to use a tool. If you simply install a tool via mise install, it won't be available in your shell. It must also be added to mise.toml—which is why I promote using mise use since it does both.

You use it like so (note that mise must be activated for this example to work):

And you'll also note that you now have a mise.toml file with the following content:

You can create a mise.toml file manually or with the CLI.

Use mise edit to open an interactive editor for your configuration. It provides a TUI where you can navigate sections, add tools from the registry with fuzzy search, and configure settings with schema-aware autocompletion.

Use mise.toml to share your tool configurations with others. This file should be committed to version control and contains the common toolset needed for your project.

For tools or settings you want to keep private, use mise.local.toml. This file should be added to .gitignore and is perfect for personal preferences or configurations.

mise supports nested configuration files that cascade from broad to specific settings:

mise will use all the parent directories together to determine the set of tools—overriding configuration as it goes lower in the hierarchy.

Use mise config ls to see the configuration files currently used by mise.

In general, it's preferred to use loose versions like node@26 in mise so that other people working on a project don't have to worry about the exact version of a tool you're using. If you'd like to pin the version to enforce a specific version, use mise use --pin or the lockfile setting.

If you leave out the version, then mise will default to node@latest.

Tools are installed with a variety of backends like aqua, github, or gitlab. See registry for the full list of shorthands like node you can use.

You can also use other backends like npm or cargo which can install any package from their respective registries:

Upgrading tool versions can be done with mise up|upgrade. By default, it will respect the version prefix in mise.toml. If a lockfile exists, mise will update mise.lock to the latest version of the tool with the prefix from mise.toml.

So if you have node = "26" in mise.toml, then mise upgrade node will upgrade to the latest version of node 26.

If you'd like to update the version in mise.toml to something newer, you can use mise upgrade --bump node. It will set the version at the same specificity as the current version, so if you have node = "24", but use mise upgrade --bump node to update to node@26, then it will set node = "26" in mise.toml.

See Dev Tools for more information on working with tools.

mise can also be used to set environment variables for your project. You can set environment variables with the CLI:

Or by directly modifying mise.toml:

Some examples on where this can be used:

Do not set secrets in a project's mise.toml, as the file is intended to be added to version control. Use mise.local.toml instead for secrets.

You can also modify PATH with mise.toml. This example makes CLIs installed with npm available:

This will add ./node_modules/.bin to the PATH for the project — with "." here referring to the directory the mise.toml file is in so if you enter a subdirectory, it will still work.

See Environments for more information on working with environment variables.

Tasks are defined in a project to execute commands.

You can define tasks in a mise.toml:

Or in a mise-tasks directory as a standalone file, such as mise-tasks/build:

Tasks are executed with mise r|run:

mise run sets up the "mise environment" before running the task (tools and environment variables). So if you'd rather not activate mise in your shell, you can use mise run to run tasks, and it will have the tools in PATH and the environment variables from mise.toml set.

mise is paired with usage which provides lots of features for documenting and running tasks.

Here is an example of a task with usage spec:

This task can be run like so:

To get the autocompletion working, set up mise autocompletions.

See Tasks for more information on working with tasks.

Since there are a lot of commands available in mise, here are what I consider the most important:

Dev tools, env vars, and tasks work together to make managing your development environment easier—especially when working with others. The goal is to have a consistent UX to interface with projects regardless of the programming languages or tools used on it.

**Examples:**

Example 1 (elixir):
```elixir
mkdir example-project && cd example-project
mise use node@26
node -v
# v26.x.x
```

Example 2 (json):
```json
[tools]
node = "26"
```

Example 3 (elixir):
```elixir
mise use npm:@antfu/ni
mise use cargo:starship
```

Example 4 (sass):
```sass
mise set MY_VAR=123
echo $MY_VAR
# 123
```

---

## Backend Plugin Development | mise-en-place

**URL:** https://mise.jdx.dev/backend-plugin-development.html

**Contents:**
- Backend Plugin Development ​
- What are Backend Plugins? ​
- Plugin Architecture ​
- Backend Methods ​
  - BackendListVersions ​
  - BackendInstall ​
  - BackendExecEnv ​
- Creating a Backend Plugin ​
  - Using the Template Repository ​
  - 1. Plugin Structure ​

The mise-backend-plugin-template provides a ready-to-use starting point with LuaCATS type definitions, stylua formatting, and hk linting pre-configured.

Backend plugins in mise use enhanced backend methods to manage multiple tools using the plugin:tool format. These plugins are perfect for package managers, tool families, and custom installations that need to manage multiple related tools.

Backend plugins extend the standard vfox plugin system with enhanced backend methods. They support:

Backend plugins are generally a git repository but can also be a directory (via mise link).

Backend plugins are implemented in Lua (version 5.1 at the moment). They use three main backend methods implemented as individual files:

Lists available versions for a tool:

Version sorting: The versions returned by BackendListVersions should be in ascending order (oldest to newest), sorted semantically (version 3.10.0 should not come before 3.2.0). Mise does not apply any additional sorting to the versions returned by this method.

Installs a specific version of a tool:

Sets up environment variables for a tool:

Use the dedicated mise-backend-plugin-template for creating backend plugins:

The template includes:

Create a directory with this structure:

Here's the complete implementation of the vfox-npm plugin that manages npm packages:

The plugin name doesn't have to match the repository name. The backend prefix will match whatever name the backend plugin was installed as.

Tip: This naming flexibility could potentially be used to have a very complex plugin backend that would behave differently based on what it was named. For example, you could install the same plugin with different names to configure different behaviors or access different tool registries.

Backend plugins receive context through the ctx parameter passed to each hook function:

Option values preserve their TOML types as native Lua equivalents. Strings remain strings, arrays become Lua sequence tables, and nested tables become Lua map tables. For example, channels = ["conda-forge", "robostack"] in mise.toml becomes a Lua table you can iterate with ipairs(ctx.options.channels).

Use debug mode to see detailed plugin execution:

Provide more meaningful error messages:

Parse versions with regex:

Use cross-platform path handling:

Handle different operating systems:

Different installation logic based on tool or version:

vfox automatically injects runtime information into your plugin:

The RUNTIME object provides:

Set multiple environment variables:

TODO: We need caching support for Shared Lua modules.

**Examples:**

Example 1 (lua):
```lua
function PLUGIN:BackendListVersions(ctx)
    local tool = ctx.tool
    local options = ctx.options
    local versions = {}

    -- Your logic to fetch versions for the tool
    -- Example: query an API, parse a registry, etc.
    -- Access custom options via options["key"] or options.key

    return {versions = versions}
end
```

Example 2 (lua):
```lua
function PLUGIN:BackendInstall(ctx)
    local tool = ctx.tool
    local version = ctx.version
    local install_path = ctx.install_path
    local download_path = ctx.download_path
    local options = ctx.options

    -- Your logic to install the tool
    -- Example: download files, extract archives, etc.
    -- Access custom options via options["key"] or options.key

    return {}
end
```

Example 3 (lua):
```lua
function PLUGIN:BackendExecEnv(ctx)
    local install_path = ctx.install_path
    local options = ctx.options

    -- Your logic to set up environment variables
    -- Example: add bin directories to PATH
    -- Access custom options via options["key"] or options.key

    return {
        env_vars = {
            {key = "PATH", value = install_path .. "/bin"}
        }
    }
end
```

Example 4 (elixir):
```elixir
# Option 1: Use GitHub's template feature (recommended)
# Visit https://github.com/jdx/mise-backend-plugin-template
# Click "Use this template" to create your repository

# Option 2: Clone and modify
git clone https://github.com/jdx/mise-backend-plugin-template my-backend-plugin
cd my-backend-plugin
rm -rf .git
git init
```

---

## Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/

**Contents:**
- Cookbook ​
- Contributing ​

Here we are sharing a few mise setups that other people have found useful.

Finally, here is how to create presets and some shell tricks you might find useful.

If you would like to share your setup, please share it in this cookbook thread.

---

## Security | mise-en-place

**URL:** https://mise.jdx.dev/security.html

**Contents:**
- Security ​
- Software verification ​
- Minimum release age ​

mise includes several supply-chain controls for installing and managing tools. These controls have different coverage depending on the backend and the metadata available from upstream.

mise provides native software verification for aqua tools without requiring external dependencies. For aqua tools, Cosign/Minisign signatures, SLSA provenance, and GitHub artifact attestations are verified automatically using mise's built-in implementation.

For other verification needs, such as GPG, you can install additional tools:

To configure aqua verification, which is enabled by default:

For lockfile checksum and provenance behavior, see mise.lock.

To limit supply-chain risk, you can restrict mise to only install versions released before a certain date or duration. This is similar to Renovate's minimum release age concept: newly published versions are ignored until they have been available for a configurable amount of time.

Supports relative durations (7d, 6mo, 1y) and absolute dates (2024-06-01). For most backends, this only affects fuzzy version resolution, such as node@20 or latest. Explicitly pinned versions like node@22.5.0 bypass the filter.

Capability depends on the backend:

Versions without timestamps are included by default. Backends without transitive dependency support may still select an older top-level tool version, but they do not constrain dependencies fetched by the tool's installer/compiler.

For npm: and pipx: transitive dependency support details, refer to the npm backend docs and pipx backend docs.

You can also set minimum_release_age per-tool to override the global setting:

Precedence: --minimum-release-age CLI flag > per-tool minimum_release_age > global minimum_release_age setting.

Use minimum_release_age_excludes to exclude tools or backends from the global/default setting:

Exclusions can match backend wildcards like npm:*, tool shorthands like trivy, or full backend IDs like npm:prettier. Matching tools skip the global setting and built-in default. Per-tool minimum_release_age options and the CLI flag still apply even when a tool matches the exclusion list.

See minimum_release_age for the setting reference.

**Examples:**

Example 1 (unknown):
```unknown
brew install gpg
```

Example 2 (sass):
```sass
# Disable specific verification methods if needed
export MISE_AQUA_COSIGN=false
export MISE_AQUA_SLSA=false
export MISE_AQUA_GITHUB_ATTESTATIONS=false
export MISE_AQUA_MINISIGN=false
```

Example 3 (json):
```json
# mise.toml
[settings]
minimum_release_age = "7d"  # only install versions released more than 7 days ago
```

Example 4 (elixir):
```elixir
# mise.toml
[settings]
minimum_release_age = "7d"  # default for all tools

[tools.trivy]
version = "latest"
minimum_release_age = "1d"  # trivy updates are time-sensitive, use a shorter window
```

---

## Environment Plugin Development | mise-en-place

**URL:** https://mise.jdx.dev/env-plugin-development.html

**Contents:**
- Environment Plugin Development ​
- Quick Start ​
- Plugin Structure ​
  - metadata.lua ​
  - hooks/mise_env.lua ​
  - hooks/mise_path.lua ​
- Context Object ​
- Configuration in mise.toml ​
- Complete Example: Secret Manager Plugin ​
- Available Lua Modules ​

Environment plugins are a special type of mise plugin that provide environment variables and PATH modifications without managing tool versions. They're ideal for integrating external services, managing secrets, and standardizing environment configuration across teams.

Unlike tool plugins and backend plugins, environment plugins:

The fastest way to create an environment plugin is to use the mise-env-plugin-template.

The mise-env-plugin-template provides a ready-to-use starting point with LuaCATS type definitions, stylua formatting, and hk linting pre-configured.

Environment plugins are implemented in Lua (version 5.1 at the moment). A minimal environment plugin has this structure:

The metadata.lua file defines your plugin's basic information:

The MiseEnv hook returns environment variables to set:

When cmd.exec() is called from MiseEnv or MisePath hooks, it inherits the mise-constructed environment — including _.path entries and environment variables from preceding directives. If the module directive is configured with tools = true (e.g., _.my-plugin = { tools = true }), tool installation bin paths are also included, so mise-managed tools are directly callable (e.g., cmd.exec("node --version")).

Return value: Either a simple array of env keys, or a table with caching metadata.

Simple format - array of tables, each with:

Extended format - table with:

Example using extended format with caching:

When cacheable = true, mise will cache the environment variables and only re-execute the plugin when:

For caching to work, users must enable the env_cache setting:

The MisePath hook returns directories to add to PATH (optional):

Return value: Array of strings (directory paths)

Both hooks receive a ctx parameter with:

For environment plugins, ctx.options is the primary way to accept user configuration.

Users configure environment plugins using the env._ directive:

Simple activation with no options:

With configuration options:

All fields in the TOML table are passed to your hooks as ctx.options.

Here's a complete example of a plugin that fetches secrets from an external service:

Environment plugins have access to mise's built-in Lua modules:

See Plugin Lua Modules for complete documentation.

For plugins that fetch data from external services, use mise's built-in caching by returning the extended format with cacheable = true:

This is preferred over manual caching because:

Note: Users must enable env_cache = true in their settings for caching to work.

Plugin not found: Make sure you've installed/linked the plugin:

Hook not executing: Enable debug logging:

Options not passed: Verify TOML syntax in mise.toml:

Once your environment plugin is ready:

See Plugin Publishing for detailed instructions.

If you have an existing tool plugin that only sets environment variables, you can simplify it to an environment-only plugin:

Before (tool plugin with unused hooks):

After (environment plugin):

**Examples:**

Example 1 (elixir):
```elixir
# Clone the template
git clone https://github.com/jdx/mise-env-plugin-template my-env-plugin
cd my-env-plugin

# Customize for your use case
# Edit metadata.lua, hooks/mise_env.lua, hooks/mise_path.lua
```

Example 2 (unknown):
```unknown
my-env-plugin/
├── metadata.lua           # Plugin metadata
└── hooks/
    ├── mise_env.lua      # Returns environment variables (required)
    └── mise_path.lua     # Returns PATH entries (optional)
```

Example 3 (yaml):
```yaml
PLUGIN = {}

--- Plugin name (required)
PLUGIN.name = "my-env-plugin"

--- Plugin version (required)
PLUGIN.version = "1.0.0"

--- Plugin description (required)
PLUGIN.description = "Provides environment variables for my service"

--- Plugin homepage (optional)
PLUGIN.homepage = "https://github.com/username/my-env-plugin"

--- Plugin license (optional)
PLUGIN.license = "MIT"

--- Minimum mise/vfox version required (optional)
PLUGIN.minRuntimeVersion = "0.3.0"
```

Example 4 (lua):
```lua
function PLUGIN:MiseEnv(ctx)
    -- Access configuration from mise.toml via ctx.options
    local api_url = ctx.options.api_url or "https://api.example.com"
    local debug = ctx.options.debug or false

    -- Return array of environment variables
    return {
        {
            key = "API_URL",
            value = api_url
        },
        {
            key = "DEBUG",
            value = tostring(debug)
        },
        {
            key = "SERVICE_TOKEN",
            value = get_token_from_somewhere()  -- Your custom logic
        }
    }
end
```

---

## Contact | mise-en-place

**URL:** https://mise.jdx.dev/contact.html

**Contents:**
- Contact ​

mise is mostly built and maintained by me, Jeff Dickey. The goal is to make local development of software easy and consistent across languages. I have spent many years building dev tools and thinking about the problems that mise addresses.

I try to use the first-person in these docs since the reality is it's generally me writing them and I think it makes it more interesting having a bit of my personality in the text.

This project is simply a labor of love. I am making it because I want to make your life as a developer easier. I hope you find it useful. Feedback is a massive driver for me. If you have anything positive or negative to say-even if it's just to say hi-please reach out to me either on Twitter, Mastodon, Discord, or jdx at this domain.

---

## Using Plugins | mise-en-place

**URL:** https://mise.jdx.dev/plugin-usage.html

**Contents:**
- Using Plugins ​
- What Are Plugins? ​
  - Backend Plugins ​
  - Tool Plugins ​
- Installing Plugins ​
  - From a Git Repository ​
  - From Zip File ​
  - From Local Directory ​
- Using Plugins (Advanced) ​
- Plugin:Tool Format ​

mise supports plugins that extend its functionality, allowing you to install tools that aren't available in the standard registry. This is particularly useful for:

Plugins are extensions that can install and manage tools not included in mise's built-in registry. They are written in Lua and come in two main types:

Backend plugins use enhanced backend methods and support the plugin:tool format:

Tool plugins use the traditional hook-based approach:

Once a plugin is installed, you can use it with the plugin:tool format:

The plugin:tool format allows a single plugin to manage multiple tools. This is particularly useful for:

Plugins can be configured in your mise.toml file:

While mise doesn't have a centralized registry for community plugins, you can find them:

The vfox-npm plugin demonstrates how to create a plugin that installs npm packages:

This is just an example plugin for testing. mise already has built-in npm support that you should use instead: mise install npm:prettier@latest

Backend plugins use enhanced backend methods that provide better performance and support for the plugin:tool format:

This architecture allows plugins to manage multiple tools efficiently while providing a consistent interface.

Tool plugins use the traditional hook-based approach:

Both architectures provide a flexible plugin system that can handle diverse installation and management needs.

When using plugins, be aware that:

**Examples:**

Example 1 (sql):
```sql
# Install a plugin from a repository
mise plugin install <plugin-name> <repository-url>

# Example: Installing the vfox-npm plugin
mise plugin install vfox-npm https://github.com/jdx/vfox-npm
```

Example 2 (sql):
```sql
# Install a plugin from a zip file over HTTPS
mise plugin install <plugin-name> <zip-url>

# Example: Installing a plugin from a zip file
mise plugin install tiny https://github.com/mise-plugins/mise-tiny.git
```

Example 3 (markdown):
```markdown
# Link a local plugin for development
mise plugin link <plugin-name> /path/to/plugin/directory
```

Example 4 (elixir):
```elixir
# Install a specific tool using the plugin
mise install vfox-npm:prettier@latest

# Use the tool
mise use vfox-npm:prettier@3.0.0

# Execute the tool
mise exec vfox-npm:prettier -- --version

# List available versions
mise ls-remote vfox-npm:prettier
```

---

## About | mise-en-place

**URL:** https://mise.jdx.dev/about.html

**Contents:**
- About ​
- Contact ​

mise (pronounced "meez") or "mise-en-place" is a development environment setup tool. The name refers to a French culinary phrase that roughly translates to "setup" or "put in place". The idea is that before one begins cooking, they should have all their utensils and ingredients ready to go in their place.

mise does the same for your projects. Using its mise.toml config file, you'll have a consistent way to setup and interact with your projects no matter what language they're written in.

Its functionality is grouped into 3 categories described below.

mise installs and manages dev tools/runtimes like node, python, or terraform both simplifying installing these tools and allowing you to specify which version of these tools to use in different projects. mise supports hundreds of dev tools.

mise manages environment variables letting you specify configuration like AWS_ACCESS_KEY_ID that may differ between projects. It can also be used to automatically activate a Python virtualenv when entering projects too.

mise is a task runner that can be used to share common tasks within a project among developers and make things like running tasks on file changes easy.

mise was initially created by Jeff Dickey. The goal is to make local development of software easy and consistent across languages. Jeff has spent many years building dev tools and thinking about the problems that mise addresses.

This project is simply a labor of love. Jeff created it because he wanted to make your life as a developer easier. We hope you find it useful. Feedback is a massive driver for us. If you have anything positive or negative to say-even if it's just to say hi-please reach out to me either on Twitter, Mastodon, Discord, or jdx at this domain.

---

## Plugin Publishing | mise-en-place

**URL:** https://mise.jdx.dev/plugin-publishing.html

**Contents:**
- Plugin Publishing ​
- Publishing Checklist ​
  - Essential Files ​
  - Optional but Recommended ​
- Repository Setup ​
  - 1. Initialize Repository ​
  - 2. Basic Directory Structure ​
  - 3. Git Ignore Configuration ​
- Versioning Strategy ​
  - Semantic Versioning ​

This guide shows how to publish and distribute your plugins, whether they are backend plugins or tool plugins. Publishing makes your plugins available to other users and ensures they can be easily installed and maintained.

Before publishing your plugin, ensure you have:

The easiest way to start is with the mise-tool-plugin-template:

Alternatively, create a repository from scratch:

Organize your plugin with this structure:

Create a .gitignore file:

Use semantic versioning (SemVer) for your plugin releases:

Update version in metadata.lua:

Create git tags for releases:

Create comprehensive test scripts:

Test your plugin manually:

Before publishing, ensure everything is ready:

Create a tagged release:

Create a GitHub release for better discoverability:

Users can install directly from your repository:

For private repositories, users need access:

You can also distribute as archives:

Establish a regular update process:

Maintain backward compatibility when possible:

Keep users informed about updates:

Plugin not installing:

**Examples:**

Example 1 (markdown):
```markdown
# Clone the template
git clone https://github.com/jdx/mise-tool-plugin-template my-plugin
cd my-plugin

# Remove template history and set up your own repository
rm -rf .git
git init
git remote add origin https://github.com/username/my-plugin.git

# Customize for your plugin
# Edit metadata.lua, hooks/*.lua, README.md, etc.
```

Example 2 (markdown):
```markdown
# Create plugin directory
mkdir my-plugin
cd my-plugin

# Initialize git repository
git init
git remote add origin https://github.com/username/my-plugin.git

# Create initial structure
touch metadata.lua
mkdir -p test
echo "# My Plugin" > README.md
```

Example 3 (unknown):
```unknown
my-plugin/
├── metadata.lua          # Plugin metadata
├── README.md            # Basic documentation
├── test/                # Test scripts
│   └── test.sh
├── .gitignore           # Git ignore rules
└── [implementation files]
```

Example 4 (unknown):
```unknown
backend-plugin/
├── metadata.lua          # Backend methods implementation
├── README.md
└── test/
    └── test.sh
```

---

## Shell tricks | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/shell-tricks.html

**Contents:**
- Shell tricks ​
- Prompt colouring ​
- Current configuration environment in powerline-go prompt ​
- Inspect what changed after mise hook ​

A collection of shell utilities leveraging mise.

In ZSH to set the prompt colour whenever mise updates the environment (e.g. on cd into a project, or due to modification of the .mise*.toml):

Now, when mise makes any updates to the environment the prompt will go blue.

powerline-go's shell-var segment can be used to display the value of an environment variable in the prompt. The current mise configuration environment, MISE_ENV is a good candidate for this.

Mostly, it is as one would expect: include shell-var in -modules, and -shell-var MISE_ENV -shell-var-no-warn-empty in arguments, and make sure MISE_ENV is exported so powerline-go can "see" it.

A gotcha as of February 2025 is that the shell-var module does not tolerate unset (as opposed to empty) environment variables. To work around this, set MISE_ENV to an empty value early in the shell startup scripts, and avoid manually unseting it. For example for bash, typically in ~/.bashrc:

Using record-query you can inspect the __MISE_DIFF and __MISE_SESSION variables to see what's changing in your environment due to the mise hook.

**Examples:**

Example 1 (lua):
```lua
# activate mise like normal
source <(command mise activate zsh)

typeset -i _mise_updated

# replace default mise hook
function _mise_hook {
  local diff=${__MISE_DIFF}
  source <(command mise hook-env -s zsh)
  [[ ${diff} == ${__MISE_DIFF} ]]
  _mise_updated=$?
}

_PROMPT="❱ "  # or _PROMPT=${PROMPT} to keep the default

function _prompt {
  if (( ${_mise_updated} )); then
    PROMPT='%F{blue}${_PROMPT}%f'
  else
    PROMPT='%(?.%F{green}${_PROMPT}%f.%F{red}${_PROMPT}%f)'
  fi
}

add-zsh-hook precmd _prompt
```

Example 2 (unknown):
```unknown
export MISE_ENV=
```

Example 3 (json):
```json
[tools]
"cargo:record-query" = "latest"
```

Example 4 (perl):
```perl
function mise_parse_env {
  rq -m < <(
    zcat -q < <(
      printf '\x1f\x8b\x08\x00\x00\x00\x00\x00'
      base64 -d <<< "$1"
    )
  )
}
```

---

## Troubleshooting | mise-en-place

**URL:** https://mise.jdx.dev/troubleshooting.html

**Contents:**
- Troubleshooting ​
- mise activate doesn't work in ~/.profile, ~/.bash_profile, ~/.zprofile ​
- Slow shell prompts ​
- mise is failing or not working right ​
- The wrong version of a tool is being used ​
- New version of a tool is not available ​
- Windows problems ​
  - Path limits ​
  - Shims leaking into WSL ​
  - shell = "bash -c" task fails with command not found from PowerShell ​

If you're looking for help with a specific error message, see Errors — this page is organized by symptom instead.

mise activate should only be used in rc files. These are the interactive ones used when a real user is using the terminal. (As opposed to being executed by an IDE or something). The prompt isn't displayed in non-interactive environments so PATH won't be modified.

For non-interactive setups, consider using shims instead which will route calls to the correct directory by looking at PWD every time they're executed. You can also call mise exec instead of expecting things to be directly on PATH. You can also run mise env in a non-interactive shell, however that will only set up the global tools. It won't modify the environment variables when entering into a different project.

mise activate --shims does not support all the features of mise activate. See shims vs path for more info.

Also see the shebang example for a way to make scripts call mise to get the runtime. That is another way to use mise without activation.

mise activate runs a hook on every prompt to check if tools or env vars need updating. This typically takes only a few milliseconds, but if your prompts feel sluggish you can profile it with MISE_TIMINGS:

First deactivate mise so the prompt hook doesn't interfere with your measurement, then run hook-env manually with timings:

Replace bash with your shell. Common causes of slow prompts:

Note that mise activate --shims moves the cost from every prompt to every tool invocation, which may or may not be faster depending on your workflow. See Shims vs PATH for tradeoffs.

First try setting MISE_DEBUG=1 or MISE_TRACE=1 and see if that gives you more information. You can also set MISE_LOG_FILE_LEVEL=debug MISE_LOG_FILE=/path/to/logfile to write logs to a file.

If something is happening with the activate hook, you can try disabling it and calling eval "$(mise hook-env)" manually. It can also be helpful to use mise env which will just output environment variables that would be set. Also consider using shims which can be more compatible.

If runtime installation isn't working right, try using the --raw flag which will install things in series and connect stdin/stdout/stderr directly to the terminal. If a plugin is trying to interact with you for some reason this will make it work.

Of course check the version of mise with mise --version and make sure it is the latest. Use mise self-update to update it. mise cache clean can be used to wipe the internal cache and mise implode can be used to remove everything except config.

Lastly, there is mise doctor which will show diagnostic information and any warnings about issues detected with your setup. If you submit a bug report, please include the output of mise doctor.

Likely this means that mise isn't first in PATH—using shims or mise activate. You can verify if this is the case by calling which -a, for example, if node@20.0.0 is being used but mise specifies node@26.0.0, first make sure that mise has this version installed and active by running mise ls node. It should not say missing and have the correct "Requested" version:

If node -v isn't showing the right version, make sure mise is activated by running mise doctor. It should not have a "problem" listed about mise not being activated. Lastly, run which -a node. If the directory listed is not a mise directory, then mise is not first in PATH. Whichever node is being run first needs to have its directory set before mise is. Typically this means setting PATH for mise shims at the end of bashrc/zshrc.

If using mise activate, you have another option of enabling MISE_ACTIVATE_AGGRESSIVE=1 which will have mise always prepend its tools to be first in PATH. If you're using something that also modifies paths dynamically like mise activate does, this may not work because the other tool may be modifying PATH after mise does.

If nothing else, you can run things with mise x -- to ensure that the correct version is being used.

There are 2 places that versions are cached so a brand new release might not appear right away.

The first is that the mise CLI caches versions for. The cache can be cleared with mise cache clear.

The second uses the https://mise-versions.jdx.dev host as a centralized place to list all of the versions of most plugins. This is intended to speed up mise and also get around GitHub rate limits when querying for new versions. Check that repo for your plugin to see if it has an updated version. This service can be disabled by setting MISE_USE_VERSIONS_HOST=0.

mise also uses the versions host as a shared cache for public GitHub release metadata and GitHub artifact attestations. This means normal installs of public github: and many aqua: tools can avoid unauthenticated GitHub API calls even in Docker builds or CI jobs that do not have a token configured. If the versions host does not have the requested metadata yet, mise falls back to GitHub's API.

mise-versions itself also struggles with rate limits but you can help it to fetch more frequently by authenticating with its GitHub app. It does not require any permissions since it simply fetches public repository information. The more people do this, the quicker mise will be able to fetch new versions of tools.

Very basic support for windows is currently available, however because Windows can't support asdf plugins, they must use core and vfox only—which means only a handful of tools are available on Windows.

If you have many tools defined in your mise.toml hierarchy, then it is possible that mise x will produce a Path environment variable that is too long for certain tools to handle, most notably, cmd.exe. This will affect mise tools that invoke cmd.exe (like npm install).

You have a few options:

You can run the following command to test whether you have hit the cmd.exe Path limitation:

When windows_shim_mode is set to file, mise writes an extension-less bash script next to each <tool>.cmd shim (so Git Bash / Cygwin can resolve the tool). WSL's default Windows-PATH interop exposes the shims directory at /mnt/c/..., where every file is treated as executable, so running a shimmed tool inside WSL executes that script natively. mise guards the generated script: when it detects WSL it drops the shims directory from PATH and runs a native Linux tool if one is installed, otherwise it fails with a plain <tool>: not found rather than recursing endlessly or erroring with mise: not found.

The default exe mode is not affected: it writes only native <tool>.exe files, which WSL ignores, so nothing leaks into Linux.

To keep the Windows shims out of WSL entirely, either install/manage the tool with mise inside WSL, or disable the Windows-PATH interop in /etc/wsl.conf:

If a task pinned to shell = "bash -c" works from Git Bash but fails with command not found from PowerShell, mise is most likely resolving bash to the WSL launcher at C:\Windows\System32\bash.exe instead of a real POSIX bash. The launcher dispatches into the WSL distribution's Linux user-space, where mise-managed Windows tools aren't visible.

mise prefers a real POSIX bash (Git Bash / MSYS2) automatically when it can find one in a standard install location. If yours is installed elsewhere, set MISE_BASH_PATH to override:

mise honors an explicit bash path as-is. If you set shell (in a task) or windows_default_inline_shell_args to an absolute path such as C:/msys64/usr/bin/bash.exe -c, mise uses exactly that binary — the MISE_BASH_PATH override and the Git Bash / MSYS2 auto-detection apply only when the shell is the bare name bash.

If your shell path contains spaces (e.g. C:\Program Files\Git\bin\bash.exe), wrap the program in double quotes so the space is not treated as an argument separator. On Windows, backslashes are treated literally, so they need no escaping; forward slashes work too:

(On macOS/Linux, shell follows POSIX quoting rules instead.)

mise also detects Cygwin bash (by a cygwin / cygwin64 / cygwin32 segment in its path) and converts PATH using Cygwin's /cygdrive/c/... form instead of Git Bash's /c/..., so binaries on PATH resolve correctly. Point MISE_BASH_PATH at your Cygwin bash so the intended one is used:

The cygdrive automount mechanism is shared by Cygwin and MSYS2 / Git Bash — both let you change the mount root in /etc/fstab (Cygwin's default is /cygdrive, Git Bash / MSYS2's is /, i.e. /c/...). mise does not read /etc/fstab, so if you changed it, set MISE_CYGDRIVE_PREFIX to match — this works for either shell:

The prefix must be absolute (start with /); a relative value like mnt is rejected with a warning and the shell's default is used instead. MISE_CYGDRIVE_PREFIX=/ collapses to the Git Bash /c/... form.

mise activate will not update PATH until the shell prompt is displayed. So if you need to access a tool provided by mise before the prompt is displayed you can either add the shims to your PATH e.g.

Or you can manually call hook-env:

For more information, see What does mise activate do?

Providing a secure supply chain is incredibly important. mise already provides a more secure experience when compared to asdf. Security-oriented evaluations and contributions are welcome. We also urge users to look after the plugins they use, and urge plugin authors to look after the users they serve.

For more details see SECURITY.md.

You may get an error like one of the following:

This can happen if the tool is hosted on GitHub, and you've hit the API rate limit. This is especially common running mise in a CI environment like GitHub Actions.

By default, mise uses https://mise-versions.jdx.dev to avoid most public GitHub API calls for release metadata and artifact attestation checks. If you still see this error, it usually means the metadata was not available from the versions host yet, MISE_USE_VERSIONS_HOST=0 is set, the tool uses a private repository, or the tool uses GitHub Enterprise/custom API settings.

See GitHub Tokens for how to configure authentication and avoid rate limits.

If you run mise use or mise install inside a script and then immediately try to use the tool, it may not be found. This is because mise activate updates PATH at the next prompt, which never happens in a script.

On many Linux distributions, ~/.profile sources ~/.bashrc and sets up your environment. However, if ~/.bash_profile exists, bash reads that instead of ~/.profile.

If you followed setup instructions that created ~/.bash_profile for mise, your existing ~/.profile configuration (including PATH, environment variables, etc.) may stop loading.

Fix: Add mise activation to ~/.bashrc instead, or source ~/.profile from your ~/.bash_profile:

If you have redact = true on any env var in your config, tasks with raw = true will appear to produce no output. This is because mise intercepts stdout/stderr to perform redaction, which conflicts with raw mode.

Workaround: Remove redact from env vars that don't need it, or accept that raw tasks won't produce visible output when redactions are active.

mise activate hooks into the shell prompt to update PATH, so historically it didn't work in non-interactive shells. With the addition of chpwd support, it does work in more situations now, but we still recommend these approaches for CI and scripts:

See also the CI/CD section in Tips & Tricks.

If you are expecting mise to automatically install a tool when you run a command that is not found (using the not_found_auto_install feature), be aware of an important limitation:

mise can only auto-install missing versions of tools that already have at least one version installed.

This is because mise does not have a way of knowing which binaries a tool provides unless there is already an installed (even inactive) version of that tool. If you have never installed any version of a tool, mise cannot determine which tool is responsible for a given binary name, and so it cannot auto-install it on demand.

**Examples:**

Example 1 (sass):
```sass
mise deactivate

# Show timing per major step (color-coded: red = slow)
MISE_TIMINGS=1 mise hook-env -s bash 2>&1 >/dev/null

# Or use =2 for detailed per-step breakdowns with cumulative time
MISE_TIMINGS=2 mise hook-env -s bash 2>&1 >/dev/null
```

Example 2 (unknown):
```unknown
$ mise ls node
Plugin  Version  Config Source       Requested
node    24.0.0  ~/.mise/config.toml  24.0.0
```

Example 3 (sass):
```sass
# Path is within limits
❯ mise x -- cmd.exe /d /s /c "where.exe where"
C:\Windows\System32\where.exe
# Path exceeds cmd.exe limits
❯ mise x -- cmd.exe /d /s /c "where.exe where"
'where.exe' is not recognized as an internal or external command,
operable program or batch file.
mise ERROR command failed: exit code 1
mise ERROR Run with --verbose or MISE_VERBOSE=1 for more information
```

Example 4 (json):
```json
[interop]
appendWindowsPath = false
```

---

## Environments | mise-en-place

**URL:** https://mise.jdx.dev/environments/

**Contents:**
- Environments ​
- Using environment variables ​
- Environment in tasks ​
- Lazy eval ​
- Redactions ​
  - Viewing Redacted Environment Variables ​
- Required Variables ​
  - Required Variable Behavior ​
  - Validation Behavior ​
  - Use Cases ​

Load the right environment variables automatically for each project directory.

Use mise to specify environment variables used for different projects.

To get started, create a mise.toml file in the root of your project directory:

To clear an env var, set it to false:

To set a fallback while preserving an existing non-empty value, use default:

This keeps NODE_ENV if it was already set before mise ran or by an earlier config file. If it is unset or empty, mise sets it to "development". Defaults can be strings or integers.

You can also use the CLI to get/set env vars:

Additionally, the mise env [--json] [--dotenv] command can be used to export the environment variables in various formats (including PATH and environment variables set by tools or plugins).

Environment variables are available when using mise x|exec, or with mise r|run (i.e. with tasks):

You can of course combine them with tools:

If mise is activated, it will automatically set environment variables in the current shell session when you cd into a directory.

If you are using shims, the environment variables will be available when using the shim:

Finally, you can also use mise en to start a new shell session with the environment variables set.

It is also possible to define environment inside a task

Environment variables typically are resolved before tools—that way you can configure tool installation with environment variables. However, sometimes you want to access environment variables produced by tools. To do that, turn the value into a map with tools = true:

Variables can be redacted from the output by setting redact = true:

You can also use the redactions array to mark multiple environment variables as sensitive:

The mise env command provides flags to work with redacted variables:

Redactions work by intercepting task output line-by-line, so they require a non-raw output mode. Tasks with raw = true bypass this interception (stdout/stderr are passed directly to the terminal), so redactions cannot be applied.

By default, mise run uses the replacing output mode which shows a progress spinner rather than full output. In CI environments, you may want to use prefix or interleave output instead so you can see full task logs while still having redactions applied:

Or set it globally in your config:

Because mise may output sensitive values that could show up in CI logs you'll need to configure your CI setup to know which values are sensitive.

For example, when using GitHub Actions, you should use ::add-mask:: to prevent secrets from appearing in logs:

Note: If you're using mise-action, it will automatically redact values marked with redact = true or matching patterns in the redactions array.

You can mark environment variables as required by setting required = true. This ensures that the variable is defined either before mise runs or in a later config file (like mise.local.toml):

You can also provide help text to guide users on how to set the variable:

When a required variable is missing, mise will show the help text in the error message to assist users.

When a variable is marked as required = true, mise validates that it is defined through one of these sources:

Required variables are useful for:

config_root is the canonical project root directory that mise uses when resolving relative paths inside configuration files. Generally, when you use relative paths in mise you're referring to this directory.

Here's some example config files and their config_root:

You can see the implementation in config_root.rs.

env._.* define special behavior for setting environment variables. (e.g.: reading env vars from a file). Since nested environment variables do not make sense, we make use of this fact by creating a key named "_" which is a TOML table for the configuration of these directives.

In mise.toml: env._.file can be used to specify a dotenv file to load.

Top-level env_file, dotenv, and env_path are deprecated. Use env._.file and env._.path instead. These keys will be removed in mise 2027.4.0.

Only dotenv-format files use dotenvy under the hood. If you have problems with dotenv parsing, you will likely need to post an issue there, not to mise since there is not much mise can do about the way that crate works. JSON, YAML, and TOML files use separate parsers.

The env._.file directive supports:

To automatically load dotenv files from the current directory and parent directories, set MISE_ENV_FILE=.env or env_file = ".env" under [settings] in ~/.config/mise/config.toml. This is different from env._.file, which resolves paths relative to the config file that declares it.

See secrets for ways to read encrypted files with env._.file.

PATH is treated specially. Use env._.path to add extra directories to the PATH, making any executables in those directories available in the shell without needing to type the full path:

The env._.path directive supports:

Relative paths like tools/bin or ./tools/bin are resolved against {{config_root}}. For example, with a config file at /path/to/project/.config/mise/config.toml, tools/bin resolves to /path/to/project/tools/bin.

Source an external bash script and pull exported environment variables out of it:

This must be a script that runs in bash as if it were executed like this:

The shebang will be ignored. See #1448 for a potential alternative that would work with binaries or other script languages.

The env._.source directive supports:

Plugins can provide their own env._ directives that dynamically set environment variables and modify your PATH. This is particularly useful for:

Simple plugin activation:

Plugin with configuration options:

When you use env._.<plugin-name>, mise:

The configuration options you provide (the TOML table after =) are passed to the plugin's hooks via ctx.options, allowing plugins to be configured per-project or per-environment.

The plugin could then fetch secrets from HashiCorp Vault and expose them as environment variables.

The plugin could detect the current git branch and set ENVIRONMENT=production when on main, or ENVIRONMENT=development otherwise.

See Environment Plugins in the Plugins documentation for a complete guide to creating your own environment plugins.

For a working example, see the mise-env-plugin-template repository.

It may be necessary to use multiple env._ directives, however TOML fails with this syntax because it has 2 identical keys in a table:

For this use-case, you can optionally make [env] an array-of-tables instead by using [[env]] instead:

It works identically but you can have multiple tables.

Environment variable values can be templates, see Templates for details.

You can use the value of an environment variable in later env vars:

Of course the ordering matters when doing this.

As a simpler alternative to Tera templates for referencing env vars, you can use shell-style $VAR syntax:

Expansion runs after Tera template rendering, so both syntaxes can be mixed. Undefined variables without a default are left unexpanded and produce a warning.

The setting controls shell expansion:

**Examples:**

Example 1 (json):
```json
[env]
NODE_ENV = 'production'
```

Example 2 (json):
```json
[env]
NODE_ENV = false # unset a previously set NODE_ENV
```

Example 3 (json):
```json
[env]
NODE_ENV = { default = "development" }
```

Example 4 (sass):
```sass
mise set NODE_ENV=development
# mise set NODE_ENV
# development

mise set
# key       value        source
# NODE_ENV  development  mise.toml

cat mise.toml
# [env]
# NODE_ENV = 'development'

mise unset NODE_ENV
```

---

## External Resources | mise-en-place

**URL:** https://mise.jdx.dev/external-resources.html

**Contents:**
- External Resources ​

Links to articles, videos, and other resources that are relevant to mise.

---

## Paranoid | mise-en-place

**URL:** https://mise.jdx.dev/paranoid.html

**Contents:**
- Paranoid ​
- Config files ​
- Community plugins ​
- Always uses HTTPS ​
- Provenance re-verification ​
- More? ​

Paranoid is an optional behavior that locks mise down more to make it harder for a bad actor to compromise your system. These are settings that I personally do not use on my own system because I find the behavior too restrictive for the benefits.

Paranoid mode can be enabled with either MISE_PARANOID=1 or a setting:

Normally mise will make sure some config files are "trusted" before loading them. This will prompt you to confirm that you want to load the file, e.g.:

In normal mode, mise checks trust before parsing mise.toml files because they can contain behavior that executes code or affects the environment. Some discovery paths that look at previously tracked configs may skip untrusted files instead of prompting. Commands that directly need an untrusted config, such as mise lock, can fail with an untrusted-config error when mise cannot prompt. When mise detects that it is running in CI, configs are assumed to be trusted unless paranoid mode is enabled.

Under paranoid, all config files must be trusted first, including formats that normally do not require trust.

Also, in normal mode, a config file only needs to be trusted a single time. In paranoid, the contents of the file are hashed to check if the file changes. If you change your config file, you'll need to trust it again.

Note that global and system config files (e.g., ~/.config/mise/config.toml) are implicitly trusted and exempt from this check. This allows paranoid mode to be enabled in a global config without requiring a trust prompt for that file itself.

Community plugins cannot be directly installed via short-name under paranoid. You can install plugins that are either core, maintained by the mise team, or plugins that mise has marked as "first-party"—meaning plugins developed by the same team that builds the tool the plugin installs.

Other than that, say for "shfmt", you'll need to specify the full git repo to install:

Unlike in normal mode where mise plugin install shfmt would be sufficient.

Some endpoints in mise are fetched over HTTP such as checking for the latest mise version and pulling version lists of tools. These are not security risks and a malicious actor injecting false data would not introduce a security risk. Normally mise uses HTTP because loading the TLS module takes about 10ms and this affects commonly used commands so it is a noticeably delay. In paranoid mode, all endpoints will be fetched over HTTPS.

Normally, when a lockfile contains both a checksum and a provenance entry for a tool, mise install trusts the lockfile and skips provenance re-verification to avoid redundant API calls (e.g., to GitHub). This is safe when you trust the lockfile was generated correctly.

In paranoid mode, mise install always re-verifies provenance (SLSA, cosign, minisign, GitHub artifact attestations) at install time, even when the lockfile already has a provenance entry. This ensures that cryptographic verification happens on every install, not just when the lockfile is first generated.

This behavior can also be enabled independently via the locked_verify_provenance setting.

If you have suggestions for more that could be added to paranoid, please let me know.

**Examples:**

Example 1 (sass):
```sass
mise settings paranoid=1
```

Example 2 (unknown):
```unknown
$ mise install
mise ~/src/mise/.tool-versions is not trusted. Trust it [y/n]?
```

Example 3 (unknown):
```unknown
mise plugin install shfmt https://github.com/luizm/asdf-shfmt
```

---

## Plugins | mise-en-place

**URL:** https://mise.jdx.dev/plugins.html

**Contents:**
- Plugins ​
- Backend Plugins ​
- Tool Plugins ​
- Environment Plugins ​
- General Plugin Usage ​
- asdf (Legacy) Plugins ​
- Plugin Authors ​
- Tool Options ​
- Templates ​

Plugins in mise are a way to extend mise with new functionality like extra tools or environment variable management.

Historically it was the only way to add new tools (as the only backend was asdf).

The way that backend works is every tool has its own plugin which needs to be manually installed. However, now with core tools and backends like aqua/github, plugins are no longer necessary to run most tools in mise.

Tool plugins should be avoided for security reasons. New tools will not be accepted into mise built with asdf/plugins unless they are very popular and aqua/github is not an option for some reason.

The only exception is if the tool needs to set env vars or has a complex installation process, as plugins can provide functionality like setting env vars globally without relying on a tool being installed. They can also provide aliases for versions.

If you want to integrate a new tool into mise, you should either try to get it into the aqua registry or see if it can be installed with github. Aqua is definitely preferred to github as it has better UX and more features like slsa verification and the ability to use different logic for older versions.

You can manage all installed plugins in mise with mise plugins.

Backend plugins provide enhanced functionality with modern backend methods. These plugins use the plugin:tool format and offer advantages over traditional plugins:

See Backend Plugin Development for creating backend plugins. You can start quickly with the mise-backend-plugin-template.

Tool plugins use the traditional hook-based approach with Lua scripts. These plugins provide:

See Tool Plugin Development for creating tool plugins. The mise-tool-plugin-template provides a ready-to-use starting point.

Environment plugins provide environment variables and PATH modifications without managing tool versions. They're ideal for integrating with secret managers, setting dynamic configurations, and standardizing team environments.

Unlike tool plugins, environment plugins:

See Environment Plugin Development for creating environment plugins. The mise-env-plugin-template repository provides a ready-to-use starting point.

For end-user documentation on installing and using both backend and tool plugins, see Using Plugins.

mise can use asdf's plugin ecosystem under the hood for backward compatibility. These plugins contain shell scripts like bin/install (for installing) and bin/list-all (for listing all of the available versions).

asdf plugins have limitations compared to modern backends and should only be used when necessary. They only work on Linux/macOS and are slower than native backends.

See asdf (Legacy) Plugins for comprehensive documentation on using and creating these plugins.

https://github.com/mise-plugins is a GitHub organization for community-developed plugins. See SECURITY.md for more details on how plugins here are treated differently.

If you'd like your plugin to be hosted here please let me know (GH discussion or discord is fine) and I'd be happy to host it for you.

mise has support for "tool options" which is configuration specified in mise.toml to change behavior of tools. One example of this is virtualenv on python runtimes:

This will be passed to all plugin scripts as MISE_TOOL_OPTS__VIRTUALENV=.venv. The user can specify any option, and it will be passed to the plugin in that format.

Currently, this only supports simple strings, but we can make it compatible with more complex types (arrays, tables) fairly easily if there is a need for it.

Plugin custom repository values can be templates, see Templates for details.

**Examples:**

Example 1 (lua):
```lua
mise plugins ls --urls
# Plugin                          Url                                                     Ref  Sha
# 1password                       https://github.com/mise-plugins/mise-1password-cli.git  HEAD f5d5aab
# vfox-mise-plugins-vfox-dart     https://github.com/mise-plugins/vfox-dart               HEAD 1424253
# ...
```

Example 2 (elixir):
```elixir
# Install a backend plugin
mise plugin install my-plugin https://github.com/username/my-plugin

# Use the plugin:tool format
mise install my-plugin:some-tool@1.0.0
mise use my-plugin:some-tool@latest
```

Example 3 (elixir):
```elixir
# Install a tool plugin
mise plugin install my-tool https://github.com/username/my-tool-plugin

# Use the tool directly
mise install my-tool@1.0.0
mise use my-tool@latest
```

Example 4 (markdown):
```markdown
# Install an environment plugin
mise plugin install my-env-plugin https://github.com/username/my-env-plugin
```

---

## Mise + Ruby Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/ruby.html

**Contents:**
- Mise + Ruby Cookbook ​
- A Ruby on Rails Project ​

Here are some tips on managing Ruby projects with mise.

**Examples:**

Example 1 (julia):
```julia
min_version = "2024.9.5"

[env]
# Project information
PROJECT_NAME = "{{ config_root | basename }}"

[tools]
# Install Ruby with the specified version
ruby = "{{ get_env(name='RUBY_VERSION', default='3.3.3') }}"

[tasks."bundle:install"]
description = "Install gem dependencies"
run = "bundle install"

[tasks.server]
description = "Start the Rails server"
alias = "s"
run = "rails server"

[tasks.test]
description = "Run tests"
alias = "t"
run = "rails test"

[tasks.lint]
description = "Run lint using Rubocop"
alias = "l"
run = "rubocop"
```

---

## Config Environments | mise-en-place

**URL:** https://mise.jdx.dev/configuration/environments.html

**Contents:**
- Config Environments ​
- Setting MISE_ENV in .miserc.toml ​
  - Templates in .miserc.toml ​
- Platform environments ​
  - Rollout ​

It's possible to have separate mise.toml files in the same directory for different environments like development and production. To enable, set MISE_ENV to an environment like development or production using one of these methods:

mise will then look for a mise.{MISE_ENV}.toml file in the current directory, parent directories and the MISE_CONFIG_DIR directory.

You can set MISE_ENV in a .miserc.toml file, which is loaded very early before other config files are discovered. This allows you to commit your environment configuration to version control:

.miserc.toml supports Tera templates, which is useful for settings like ceiling_paths that reference home or XDG directories:

Note that only OS-level context is available (environment variables, cwd, arch(), os(), etc.) — settings from mise.toml are not yet loaded at this stage.

File locations searched (in order of precedence):

Note: MISE_ENV cannot be set in mise.toml because it determines which config files to load in the first place.

mise will also look for "local" files like mise.local.toml and mise.{MISE_ENV}.local.toml in the current directory and parent directories. These are intended to not be committed to version control. (Add mise.local.toml and mise.*.local.toml to your .gitignore file.)

The priority of these files goes in this order (top overrides bottom):

If MISE_OVERRIDE_CONFIG_FILENAMES is set, that will be used instead of all of this.

You can also use paths like mise/config.{MISE_ENV}.toml or .config/mise.{MISE_ENV}.toml Those rules follow the order in Configuration.

Use mise config to see which files are being used.

The rules around which file is written are different because we ultimately need to choose one. See the docs for mise use for more information.

Multiple environments can be specified, e.g. MISE_ENV=ci,test with the last one taking precedence.

With the auto_env setting enabled, mise automatically treats the following as active config environments, based on the current platform:

Architectures use mise's remapped names: x86_64 → x64 and aarch64 → arm64.

This makes config files like mise.windows.toml, mise.macos-arm64.toml, or mise.unix.toml load automatically, and matching lockfiles like mise.windows.lock get selected. All of the usual config file locations and .local.toml variants work.

Platform environments have lower precedence than explicit MISE_ENV entries. The full order is (later overrides earlier): unix < {os} < {os}-{arch} < explicit MISE_ENV entries.

Platform environments only affect config file discovery and lockfile selection. They are not added to MISE_ENV itself: the template variable and the MISE_ENV variable passed to subprocesses and tasks only reflect explicit environments.

auto_env is currently disabled by default. Starting with mise 2027.6.0 it will default to enabled; from 2026.12.0 until then, mise warns if it finds a platform-specific config file that would be newly loaded. To control the behavior explicitly:

or set MISE_AUTO_ENV=true / MISE_AUTO_ENV=false. Like MISE_ENV, this is an early-init setting: it must be set in .miserc.toml or via the environment variable — setting it in mise.toml has no effect because config file discovery has already happened by the time mise.toml is read.

**Examples:**

Example 1 (markdown):
```markdown
# .miserc.toml
env = ["development"]
```

Example 2 (elixir):
```elixir
# .miserc.toml

# Stop config search at $HOME
ceiling_paths = ["{{ env.HOME }}"]

# Or use the XDG config home variable
ignored_config_paths = ["{{ xdg_config_home }}/mise/shared.toml"]
```

Example 3 (markdown):
```markdown
# .miserc.toml
auto_env = true # adopt the new behavior now
# or
auto_env = false # keep the old behavior and silence the warning
```

---

## mise-docs | mise-en-place

**URL:** https://mise.jdx.dev/README.html

**Contents:**
- mise-docs ​

This repository contains the documentation website for the runtime executor mise. The website is powered by VitePress.

---

## Core Tools | mise-en-place

**URL:** https://mise.jdx.dev/core-tools.html

**Contents:**
- Core Tools ​

mise comes with some plugins built into the CLI written in Rust. These are new and will improve over time.

They can be easily overridden by installing an asdf/vfox plugin with the same name, e.g.: mise plugin install python https://github.com/asdf-community/asdf-python.

You can see the core plugins with mise registry -b core.

---

## Demo | mise-en-place

**URL:** https://mise.jdx.dev/demo.html

**Contents:**
- Demo ​
- Transcript ​

The following demo shows:

mise exec <tool> -- <command> allows you to run any tools with mise

node is only available in the mise environment, not globally

Here is another example where we run terraform with mise exec

mise exec is great for running one-off commands, however it can be convenient to activate mise. When activated, mise will automatically update your PATH to include the tools you have installed, making them available directly.

We will start by installing node@lts and make it the global default

Note that we get back the path to the real node here, not a shim.

We can also install other tools with mise. For example, we will install terraform, jq, and go

Let's enter a project directory where we will set up node@26

As expected, node -v is now v26.x

We will leave this directory. The node version will revert to the global LTS version

**Examples:**

Example 1 (elixir):
```elixir
mise exec node@26 -- node -v
# mise node@26.x.x ✓ installed
# v26.x.x
```

Example 2 (markdown):
```markdown
node -v
# bash: node: command not found
```

Example 3 (elixir):
```elixir
mise exec terraform -- terraform -v
# mise terraform@1.11.3 ✓ installed
# Terraform v1.11.3
```

Example 4 (elixir):
```elixir
mise use --global node@lts
# v22.14.0
```

---

## Presets | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/presets.html

**Contents:**
- Presets ​
- Example python preset ​

You can create your own presets by leveraging mise tasks to reduce boilerplate and make it easier to set up new projects.

Here is an example of how to create your python preset that creates a mise.toml file to work with python and pdm

Then in any directory, you can run mise preset:pdm 3.10 to scaffold a new project with python and pdm:

Here is the generated mise.toml file:

**Examples:**

Example 1 (elixir):
```elixir
#!/usr/bin/env bash
#MISE dir="{{cwd}}"

mise use pre-commit
mise config set env._.python.venv.path .venv
mise config set env._.python.venv.create true -t bool
mise tasks add lint -- pre-commit run -a
```

Example 2 (elixir):
```elixir
#!/usr/bin/env bash
#MISE dir="{{cwd}}"
#MISE depends=["preset:python"]
#USAGE arg "<version>"

mise use python@${usage_version?}
mise use pdm@latest
mise config set hooks.postinstall "pdm sync"
```

Example 3 (julia):
```julia
cd my-project
mise preset:pdm 3.10
# [preset:python] $ ~/.config/mise/tasks/preset/python
# mise WARN  No untrusted config files found.
# mise ~/my-project/mise.toml tools: pre-commit@4.0.1
# [preset:pdm] $ ~/.config/mise/tasks/preset/pdm 3.10
# mise WARN  No untrusted config files found.
# mise ~/my-project/mise.toml tools: python@3.10.15
# mise ~/my-project/mise.toml tools: pdm@2.21.0
# mise creating venv with uv at: ~/my-project/.venv
# Using CPython 3.10.15 interpreter at: /Users/simon/.local/share/mise/installs/python/3.10.15/bin/python
# Creating virtual environment at: .venv
# Activate with: source .venv/bin/activate.fish

~/my-project via 🐍 v3.10.15 (.venv)
# we are in the virtual environment ^
```

Example 4 (json):
```json
[tools]
pdm = "latest"
pre-commit = "latest"
python = "3.10"

[hooks]
postinstall = "pdm sync"

[env]
[env._]
[env._.python]
[env._.python.venv]
path = ".venv"
create = true

[tasks.lint]
run = "pre-commit run -a"
```

---

## sops | mise-en-place

**URL:** https://mise.jdx.dev/environments/secrets/sops.html

**Contents:**
- sops experimental ​
- Example ​
- Encrypt with sops ​
- Environment Variables ​
- Redaction ​
  - CI masking (GitHub Actions) ​
- Settings ​
- sops.age_key
- sops.age_key_file
- sops.age_recipients

mise reads encrypted secret files and makes values available as environment variables via env._.file.

mise will automatically decrypt the file if it is sops-encrypted.

Currently age is the only sops encryption method supported.

The external sops CLI does not currently support TOML input/output. mise can decrypt SOPS-encrypted .env.toml files only with the default sops.rops = true setting. If you set sops.rops = false, mise shells out to the sops CLI and encrypted TOML env files fail with a configuration error. Use .env.json or .env.yaml when you need the external CLI path.

Install tools: mise use -g sops age

Generate an age key and note the public key:

The -i overwrites the file. The encrypted file is safe to commit. Set SOPS_AGE_KEY_FILE=~/.config/mise/age.txt or MISE_SOPS_AGE_KEY_FILE=~/.config/mise/age.txt to decrypt/edit with sops.

Now mise env exposes the values.

mise supports both mise-specific environment variables and standard SOPS ones:

Mise-specific variables (highest priority):

Standard SOPS variables (fallback):

This allows you to override SOPS settings specifically for mise while keeping your standard SOPS configuration intact for other tools.

Mark secrets from files as sensitive:

Work with redacted values:

If you use mise-action, values marked redact = true are masked automatically.

The age private key to use for sops secret decryption. Takes precedence over standard SOPS_AGE_KEY environment variable.

Path to the age private key file for sops secret decryption. Takes precedence over standard SOPS_AGE_KEY_FILE environment variable.

The age public keys to use for sops secret encryption.

Use rops to decrypt sops files. Disable to shell out to sops which will slow down mise but sops may offer features not available in rops. Required for TOML SOPS files because the sops CLI does not support TOML.

If true, fail when sops decryption fails (including when sops is not available, the key is missing, or the key is invalid). If false, skip decryption and continue in these cases.

**Examples:**

Example 1 (json):
```json
{
  "AWS_ACCESS_KEY_ID": "AKIAIOSFODNN7EXAMPLE",
  "AWS_SECRET_ACCESS_KEY": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
}
```

Example 2 (json):
```json
[env]
_.file = ".env.json"
```

Example 3 (jsx):
```jsx
age-keygen -o ~/.config/mise/age.txt
# Public key: <public key>
```

Example 4 (jsx):
```jsx
sops encrypt -i --age "<public key>" .env.json
```

---

## Directory Structure | mise-en-place

**URL:** https://mise.jdx.dev/directories.html

**Contents:**
- Directory Structure ​
- ~/.config/mise ​
- ~/.cache/mise ​
- ~/.local/state/mise ​
- ~/.local/share/mise ​
  - ~/.local/share/mise/downloads ​
  - ~/.local/share/mise/plugins ​
  - ~/.local/share/mise/installs ​
  - ~/.local/share/mise/shims ​

The following are the directories that mise uses.

If you often find yourself using these directories (as I do), I suggest setting all of them to ~/.mise for easy access.

This directory stores the global configuration file ~/.config/mise/config.toml. This is intended to go into your dotfiles repo to share across machines.

Stores internal cache that mise uses for things like the list of all available versions of a plugin. Do not share this across machines. You may delete this directory any time mise isn't actively installing something. Do this with mise cache clear. See Cache Behavior for more information.

Used for storing state local to the machine such as which config files are trusted. These should not be shared across machines.

This is the main directory that mise uses and is where plugins and tools are installed into. It is nearly identical to ~/.asdf in asdf, so much so that you may be able to get by symlinking these together and using asdf and mise simultaneously. (Supporting this isn't a project goal, however).

This directory could be shared across machines but only if they run the same OS/arch. In general I wouldn't advise doing so.

This is where plugins may write downloaded assets such as tarballs during installation. mise removes these files by default after install/uninstall; set always_keep_download to keep them for debugging backend/plugin install behavior. This directory is not a supported download cache. Some backends may skip a download when the expected file already exists, but that behavior is backend-specific and not guaranteed. Cache ~/.local/share/mise/installs instead if you want to avoid reinstalling tools in CI or offline workflows.

mise installs plugins to this directory when running mise plugins install. If you are working on a plugin, I suggest symlinking it manually by running:

This is where tools are installed to when running mise install. For example, mise install node@20.0.0 will install to ~/.local/share/mise/installs/node/20.0.0

This will also create other symlinks to this directory for version prefixes ("20" and "20.15") and matching aliases ("lts", "latest"). For example:

You can set the MISE_INSTALLS_DIR environment variable to override this location.

This is where mise places shims. Generally these are used for IDE integration or if mise activate does not work for some reason.

**Examples:**

Example 1 (unknown):
```unknown
ln -s ~/src/mise-my-tool ~/.local/share/mise/plugins/my-tool
```

Example 2 (perl):
```perl
$ tree ~/.local/share/mise/installs/node
20 -> ./20.15.0
20.15 -> ./20.15.0
lts -> ./20.15.0
latest -> ./20.15.0
```

---

## Glossary | mise-en-place

**URL:** https://mise.jdx.dev/glossary.html

**Contents:**
- Glossary ​
- Core Concepts ​
- Backends ​
- Shell Integration ​
- Configuration ​
- Environment Variables ​
- Hooks ​
- Tasks ​
- Directories & Environment ​
- Other Terms ​

This glossary defines key terms and concepts used throughout the mise documentation.

Activation : The process of loading mise's context (tools, environment variables, PATH modifications) into your shell session. Typically done via eval "$(mise activate bash)" in your shell rc file. See Installing mise for setup instructions.

Backend : A package manager or ecosystem that mise uses to install and manage tools. Each backend knows how to fetch, install, and manage tools from its respective source. See Backends below and Backend Architecture for details.

Core Tools : Built-in tool implementations written in Rust that ship with mise. These provide first-class support for popular languages like Node.js, Python, Ruby, Go, and others. See Core tools for the full list.

mise.toml : The primary configuration file for mise projects. Contains tool versions, environment variables, tasks, and hooks. See Configuration for the full specification.

mise.local.toml : A user-local configuration file that overrides mise.toml. Typically added to .gitignore for personal settings that shouldn't be shared with the team.

Plugin : An extension that adds functionality to mise, such as managing additional tools or setting up environment variables. See Plugins for an overview.

Registry : The collection of tool aliases that map user-friendly short names to their full backend specifications. For example, aws-cli maps to aqua:aws/aws-cli. See Registry.

Tool : A development tool or runtime that mise can install and manage, such as node, python, terraform, or jq.

Tool Request : A user's specification for a tool version, which may be fuzzy or use aliases. Examples: node@18, python@latest, go@1.21. These get resolved to concrete Tool Versions.

Tool Version : A concrete, resolved version of a tool. For example, node@18 (tool request) might resolve to node@18.19.0 (tool version).

Toolset : An immutable collection of resolved tools for a specific context, containing all the Tool Versions that should be active for a directory or project.

mise supports multiple backends for installing tools from different sources:

aqua : Backend using the aqua-proj registry. Supports SLSA provenance verification and provides access to thousands of tools. See aqua backend.

asdf : Legacy backend compatible with asdf shell-script plugins. Linux and macOS only. Slower than native backends but provides access to the asdf plugin ecosystem. See asdf backend.

cargo : Installs Rust tools by compiling them with cargo install. See cargo backend.

conda : Installs packages from Conda repositories. See conda backend.

dotnet : Installs .NET tools. See dotnet backend.

gem : Installs Ruby gems as tools. See gem backend.

github : Installs tools directly from GitHub releases. See github backend.

gitlab : Installs tools directly from GitLab releases. See gitlab backend.

go : Installs Go tools using go install. See go backend.

http : Installs tools from arbitrary HTTP/HTTPS URLs. See http backend.

npm : Installs Node.js packages and CLI tools from the npm registry. See npm backend.

pipx : Installs Python CLI tools in isolated environments using pipx. See pipx backend.

spm : Installs tools via Swift Package Manager. See spm backend.

ubi : Universal Binary Installer for tools distributed as single binaries. See ubi backend.

vfox : Backend compatible with VersionFox plugins. See vfox backend.

hook-env : The mise hook-env command that exports environment changes for shell integration. Called automatically by the shell hook installed via mise activate.

PATH Activation : The default method of shell integration where mise updates the PATH environment variable at each prompt to include the appropriate tool binaries.

Reshim : The process of updating the shims directory after tools are installed or removed. Run mise reshim if shims get out of sync.

Shims : Small executable scripts that intercept tool commands and delegate to mise, which loads the appropriate tool context before execution. An alternative to PATH activation. See Shims.

config_root : The canonical project root directory that mise uses when resolving relative paths in configuration files. Set via the MISE_PROJECT_ROOT environment variable or detected automatically.

Configuration Environments : Environment-specific configuration files like mise.dev.toml or mise.prod.toml, activated via the MISE_ENV environment variable. See Configuration Environments.

Configuration Hierarchy : The system where mise.toml files at different levels (system, global, project) are merged together, with files closer to the current directory taking precedence over parent directories.

Settings : Global mise configuration options stored in ~/.config/mise/settings.toml that define behavior across all projects. See Settings.

Templates : Dynamic values in configuration using Tera template syntax, like {{env.HOME}} or {{arch()}}. See Templates.

env._ directives : Special environment configuration directives for advanced setup:

Lazy Evaluation : Environment variables configured with tools = true that can access tool-provided environment variables. These are evaluated after tools are loaded.

Redaction : Marking sensitive environment variables with redact = true to hide their values from mise output and logs.

Hooks : Scripts that automatically execute during mise activation at specific events. An experimental feature. See Hooks.

cd hook : Runs whenever you change directories while mise is active.

enter hook : Runs when entering a directory where a mise.toml becomes active.

leave hook : Runs when leaving a directory where a mise.toml was active.

postinstall hook : Runs after a tool is successfully installed.

preinstall hook : Runs before a tool installation begins.

watch_files hook : Runs when specified files change. Requires mise activate for file watching.

Dependency Graph : A Directed Acyclic Graph (DAG) used internally to resolve task execution order based on dependencies.

File Tasks : Tasks defined as standalone executable scripts in directories like mise-tasks/ or .mise/tasks/. See File Tasks.

Task : A reusable command defined in mise.toml or as a standalone script that executes within the mise environment. See Tasks.

Task Dependencies : Relationships between tasks defined via depends (run before), depends_post (run after), or wait_for (wait but don't trigger). See Task Configuration.

TOML Tasks : Tasks defined directly in the [tasks] section of mise.toml files. See TOML Tasks.

MISE_CACHE_DIR : Directory where mise caches downloaded files and metadata. Defaults to ~/.cache/mise on Linux, ~/Library/Caches/mise on macOS.

MISE_DATA_DIR : Directory where mise stores installed tools and other persistent data. Defaults to ~/.local/share/mise.

MISE_PROJECT_ROOT : Environment variable automatically set to the root directory of the current project (where the mise.toml is located).

Tool Aliases : Alternative names for tool backends or tool versions, managed via mise tool-alias or the [tool_alias] config section. Backend aliases let a short name like node point to a custom backend. Version aliases let symbolic names like lts-iron map to a concrete version number. See Tool Aliases.

Shell Aliases : Shell command aliases (example: ll = "ls -la") managed via mise shell-alias or the [shell_alias] config section. They are set dynamically when entering a directory and unset when leaving it, similar to environment variables. Supported in bash, zsh, fish, and xonsh. See Shell Aliases.

direnv : An external tool for environment management that mise can work alongside. See direnv integration.

mise-en-place : French culinary phrase meaning "everything in its place" - the philosophy behind mise. Chefs prepare all ingredients before cooking; developers should have all tools ready before coding.

mise.lock : A lockfile that records exact resolved versions for reproducible environments across machines and CI. See mise.lock.

Tool Options : Configuration in mise.toml that changes tool behavior, such as setting a Python virtualenv path or Node.js corepack preferences.

---

## Cache Behavior | mise-en-place

**URL:** https://mise.jdx.dev/cache-behavior.html

**Contents:**
- Cache Behavior ​
- Tool Cache ​
- Environment Caching ​
- Cache auto-pruning ​

mise makes use of caching in many places in order to be efficient. The details about how long to keep cache for should eventually all be configurable. There may be gaps in the current behavior where things are hardcoded, but I'm happy to add more settings to cover whatever config is needed.

Below I explain the behavior it uses around caching. If you're seeing behavior where things don't appear to be updating, this is a good place to start.

Each tool/backend has a cache that's stored in ~/$MISE_CACHE_DIR/<TOOL>. It stores the list of versions available for that tool (mise ls-remote <TOOL>), the idiomatic filenames (see below), the list of aliases, the bin directories within each tool installation, and the result of running exec-env after the tool was installed.

Remote versions are updated daily by default. The file is zlib messagepack, if you want to view it you can run the following (requires msgpack-cli).

Note that the caching of exec-env may be problematic if the script isn't simply exporting static values. The vast majority of exec-env scripts only export static values.

Caching exec-env massively improved the performance of mise since it requires calling bash every time mise is initialized.

For more advanced caching needs (including dynamic environment providers like secret managers), mise provides the env_cache setting. When enabled, mise caches the computed environment to disk with encryption.

Cache invalidation happens automatically when:

Env plugins (vfox modules) can declare themselves cacheable by returning {cacheable = true, watch_files = [...]} from their MiseEnv hook. See Env Plugin Development for details.

Directives can opt out of caching by setting cacheable = false:

mise will automatically delete old files in its cache directory (configured with cache_prune_age). Much of the contents are also ignored by mise if they are >24 hours old or a few days. For this reason, it's likely wasteful to store this directory in CI jobs.

**Examples:**

Example 1 (perl):
```perl
cat ~/$MISE_CACHE_DIR/node/remote_versions.msgpack.z | perl -e 'use Compress::Raw::Zlib;my $d=new Compress::Raw::Zlib::Inflate();my $o;undef $/;$d->inflate(<>,$o);print $o;' | msgpack-cli decode
```

Example 2 (json):
```json
# ~/.config/mise/config.toml
[settings]
env_cache = true
env_cache_ttl = "1h"  # optional, default is 1h
```

Example 3 (json):
```json
[env]
TIMESTAMP = { value = "{{ now() }}", cacheable = false }
_.source = { file = "dynamic.sh", cacheable = false }
```

---

## Installing Mise | mise-en-place

**URL:** https://mise.jdx.dev/installing-mise.html

**Contents:**
- Installing Mise ​
- Installation Methods ​
  - https://mise.run ​
    - Shell-specific installation + activation ​
  - apk ​
  - apt ​
  - pacman ​
  - Cargo ​
  - dnf ​
    - Fedora 41+, CentOS Stream 9+, RHEL 10+ ​

If you are new to mise, follow the Getting Started guide first.

This page lists various ways to install mise on your system.

Which methods auto-update?

Package managers (apt, dnf, brew, pacman, etc.) update mise when you update system packages. Other methods can be updated with mise self-update.

mise connects to many external registries and backends, such as aqua, GitHub releases, language package registries, and system package managers. Those services change over time, so mise works best when the CLI is kept on a recent version.

Projects and organizations should generally set a min_version when they need a newer mise feature instead of locking every user to a specific mise executable. While there are ways to pin or bootstrap a particular mise version, locking users to one mise version is generally discouraged. Pinning mise back is like preventing apt update or brew update from refreshing package metadata: it can hide deprecation messages and cause bit rot with upstream integrations like aqua-registry. Breaking changes are avoided unless they go through a long deprecation process, so staying current should usually be low risk.

Note that it isn't necessary for mise to be on PATH. If you run the activate script in your shell's rc file, mise will automatically add itself to PATH.

For a more streamlined setup, you can use shell-specific endpoints that will install mise and automatically configure activation in your shell's configuration file:

These shell-specific installers will:

If you want to verify the install script hasn't been tampered with:

As long as you don't change the version with MISE_VERSION, the install script will be pinned to whatever the latest version was when it was downloaded with checksums inside the file. This makes downloading the file and putting it into a project a great way to ensure that anyone installing with that script fetches the exact same mise bin.

If you need something else, compile it with cargo install mise (see below).

mise lives in the community repository.

On Ubuntu 26.04+, mise is available via a PPA:

On Debian 11+ and Ubuntu 22.04+, mise repository can be enabled with extrepo:

Build from source with Cargo:

Do it faster with cargo-binstall:

Build from the latest commit in main:

RHEL 9 AppStream is currently frozen at Rust 1.88, which is older than mise's minimum supported Rust version. Use the CentOS Stream 9 build instead — the resulting binary works on RHEL 9 derivatives:

See the Docker cookbook for tips on using mise with Docker.

mise is available on npm as a precompiled binary. This isn't a Node.js package—just distributed via npm. This is useful for JS projects that want to setup mise via package.json or npx.

Use npx if you just want to test it out for a single command without fully installing:

The legacy @jdxcode/mise package is still published.

Download the latest release from GitHub.

For the Nix package manager, at release 24.05 or later:

You can also import the package directly using mise-flake.packages.${system}.mise. It supports all default Nix systems.

NixOS compiles from source by default

For precompiled binaries, enable nix-ld and disable all_compile.

This is the recommended way to install mise on Windows. It will automatically add your shims to PATH.

chocolatey version is currently outdated.

Download the latest release from GitHub and add the binary to your PATH.

If your shell does not support mise activate, you would want to edit PATH to include the shims directory (by default: %LOCALAPPDATA%\mise\shims).

For homebrew and possibly other installs mise is automatically activated so this is not necessary.

See MISE_FISH_AUTO_ACTIVATE=1 for more information.

See about_Profiles docs to find your actual profile location. You will need to first create the parent directory if it does not exist.

Nu does not support eval Install Mise by appending env.nu and config.nu:

If you prefer to keep your dotfiles clean you can save it to a different directory then update $env.NU_LIB_DIRS:

Since .xsh files are not compiled you may shave a bit off startup time by using a pure Python import: add the code below to, for example, ~/.config/xonsh/mise.py config file and import mise it in ~/.config/xonsh/rc.xsh:

Or continue to use rc.xsh/.xonshrc:

Given that mise replaces both shell env $PATH and OS environ PATH, watch out that your configs don't have these two set differently (might throw os.environ['PATH'] = xonsh.built_ins.XSH.env.get_detyped('PATH') at the end of a config to make sure they match)

Add following to your rc.elv:

Optionally alias mise to mise:mise for seamless integration of mise {activate,deactivate,shell}:

Adding a new shell is not hard at all since very little shell code is in this project. See here for how the others are implemented. If your shell isn't currently supported I'd be happy to help you get yours integrated.

Some installation methods automatically install autocompletion scripts.

The mise completion command can generate autocompletion scripts for your shell. This requires usage to be installed. If you don't have it, install it with:

Then, run the following commands to install the completion script for your shell:

Then source your shell's rc file or restart your shell.

If you encounter issues after installation, run:

This will diagnose common problems with your mise setup. See mise doctor for more information.

Use mise implode to uninstall mise. This will remove the mise binary and all of its data. Use mise implode --help for more information.

Alternatively, manually remove the following directories to fully clean up:

**Examples:**

Example 1 (unknown):
```unknown
curl https://mise.run | sh
```

Example 2 (unknown):
```unknown
curl https://mise.run | MISE_INSTALL_PATH=/usr/local/bin/mise sh
```

Example 3 (markdown):
```markdown
curl https://mise.run/zsh | sh
# Installs mise and adds activation to ~/.zshrc
```

Example 4 (markdown):
```markdown
curl https://mise.run/bash | sh
# Installs mise and adds activation to ~/.bashrc
```

---

## direnv | mise-en-place

**URL:** https://mise.jdx.dev/direnv.html

**Contents:**
- direnv deprecated ​
- mise inside of direnv (use mise in .envrc) ​
  - Do you need direnv? ​

direnv and mise both manage environment variables based on directory. Because they both analyze the current environment variables before and after their respective "hook" commands are run, they can sometimes conflict with each other.

The official stance is you should not use direnv with mise. Issues arising from incompatibilities are not considered bugs and PRs to improve direnv compatibility will not be accepted. While that's the official stance, the reality is mise and direnv can coexist for simple cases like setting unrelated environment variables. Anything involving PATH — which is most of what people use both tools for — is where problems arise.

If you have an issue, it's likely to do with the ordering of PATH. This means it would really only be a problem if you were trying to manage the same tool with direnv and mise. For example, you may use layout python in an .envrc but also be maintaining a .tool-versions file with python in it as well.

A more typical usage of direnv would be to set some arbitrary environment variables, or add unrelated binaries to PATH. In these cases, mise will not interfere with direnv.

use mise is deprecated and no longer supported.

If you do encounter issues with mise activate, or just want to use direnv in an alternate way, this is a simpler setup that's less likely to cause issues—at the cost of functionality.

This may be required if you want to use direnv's layout python with mise. Otherwise there are situations where mise will override direnv's PATH. use mise ensures that direnv always has control.

To do this, first use mise to build a use_mise function that you can use in .envrc files:

Now in your .envrc file add the following:

direnv will now call mise to export its environment variables. You'll need to make sure to add use_mise to all projects that use mise (or use direnv's source_up to load it from a subdirectory). You can also add use mise to ~/.config/direnv/direnvrc.

Note that in this method direnv typically won't know to refresh .tool-versions files unless they're at the same level as a .envrc file. You'll likely always want to have a .envrc file next to your .tool-versions for this reason. To make this a little easier to manage, I encourage not actually using .tool-versions at all, and instead setting environment variables entirely in .envrc:

Of course if you use mise activate, then these steps won't have been necessary and you can use mise as if direnv was not used.

If you continue to struggle, you can also try using the shims method.

mise is capable of replacing direnv for most use-cases. This is why mise includes support for managing env vars and virtualenv for python using mise.toml.

**Examples:**

Example 1 (unknown):
```unknown
mise direnv activate > ~/.config/direnv/lib/use_mise.sh
```

Example 2 (sass):
```sass
export MISE_NODE_VERSION=20.0.0
export MISE_PYTHON_VERSION=3.11
```

---

## Mise + Python Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/python.html

**Contents:**
- Mise + Python Cookbook ​
- A Python Project with virtualenv ​
- mise + uv ​
  - Syncing python versions installed by mise and uv ​
  - uv scripts ​

Here are some tips on managing Python projects with mise.

Here is an example python project with a requirements.txt file.

If you are using a uv project initialized with uv init ., here is how you can use it with mise.

Here is how the uv project will look like:

If you run uv run main.py in the uv project, uv will automatically create a virtual environment for you using the python version specified in the .python-version file. This will also create a uv.lock file.

mise will detect the python version in .python-version, however, it won't use the virtual env created by uv by default. So, using which python will show a global python installation from mise.

If you want mise to use the virtual environment created by uv, you can set the python.uv_venv_auto setting in your mise.toml file. Use "source" to only source an existing .venv, or "create|source" to create it if missing and then source it. If you prefer mise deps to create the venv, keep it at "source", enable [deps.uv], and run mise deps.

Using which python will now show the python version from the virtual environment created by uv.

Another option is to use _.python.venv in your mise.toml file to specify the path to the virtual environment created by uv.

You can use mise sync python --uv to sync the python version installed by mise with the python version specified in the .python-version file in the uv project.

You can take advantage of uv run in shebang in toml or file tasks. Note that using --script is required if the filename does not end in .py.

Here is an example toml task:

You can then run it with mise run print_peps:

**Examples:**

Example 1 (elixir):
```elixir
min_version = "2024.9.5"

[env]
# Use the project name derived from the current directory
PROJECT_NAME = "{{ config_root | basename }}"

# Automatic virtualenv activation
_.python.venv = { path = ".venv", create = true }

[tools]
python = "{{ get_env(name='PYTHON_VERSION', default='3.11') }}"
ruff = "latest"

[tasks.install]
description = "Install dependencies"
alias = "i"
run = "uv pip install -r requirements.txt"

[tasks.run]
description = "Run the application"
run = "python app.py"

[tasks.test]
description = "Run tests"
run = "pytest tests/"

[tasks.lint]
description = "Lint the code"
run = "ruff src/"

[tasks.info]
description = "Print project information"
run = '''
echo "Project: $PROJECT_NAME"
echo "Virtual Environment: $VIRTUAL_ENV"
'''
```

Example 2 (markdown):
```markdown
.
├── .gitignore
├── .python-version
├── main.py
├── pyproject.toml
└── README.md

cat .python-version
# 3.12
```

Example 3 (markdown):
```markdown
mise i
which python
# ~/.local/share/mise/installs/python/3.12.4/bin/python
```

Example 4 (json):
```json
[settings]
python.uv_venv_auto = "source"
# or, to create if missing
# python.uv_venv_auto = "create|source"
```

---

## Mise + Node.js Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/nodejs.html

**Contents:**
- Mise + Node.js Cookbook ​
- Getting started with Node.js ​
- Add node modules binaries to the PATH ​
- Example Node.js Project ​
- Example with pnpm ​

Here are some tips on managing Node.js projects with mise.

To install Node.JS, in a directory, you can use the following command:

This will install the latest version of Node.js and create a mise.toml file with the following content:

If you want to install Node.JS globally instead (for example, node v26), you can use the following command:

When installing Node.js packages specified in package.json, you typically need to use npx or the full path to the binary. For example:

Thanks to mise, you can add the node modules binaries to the PATH. This will make CLIs installed with npm available without npx.

This example uses pnpm as the package manager. This will skip installing dependencies if the lock file hasn't changed.

With this setup, getting started in a NodeJS project is as simple as running mise dev:

**Examples:**

Example 1 (elixir):
```elixir
mise use node
```

Example 2 (unknown):
```unknown
node = "latest"
```

Example 3 (elixir):
```elixir
mise use -g node@26
```

Example 4 (unknown):
```unknown
npm install --save eslint
eslint --version # doesn't work
npx eslint --version # works
```

---

## Continuous integration | mise-en-place

**URL:** https://mise.jdx.dev/continuous-integration.html

**Contents:**
- Continuous integration ​
- Any CI provider ​
  - Bootstrapping ​
- GitHub Actions ​
- GitLab CI ​
  - Example with the bootstrap script ​
- Xcode Cloud ​

You can use Mise in continuous integration environments to provision the environment with the tools the project needs. We recommend that your project pins the tools to a specific version to ensure the environment is reproducible.

Continuous integration pipelines allow running arbitrary commands. You can use this to install Mise and run mise install to install the tools:

To ensure you run the version of the tools installed by Mise, make sure you run them through the mise x command:

Alternatively, you can add the shims directory to your PATH, if the CI provider allows it.

An alternative to calling curl https://mise.run | sh is to use mise generate bootstrap to generate a script that runs and install mise.

Add the .mise/ to your .gitignore and commit the generated ./bin/mise file. You can now use ./bin/mise to install and run mise directly in CI.

If you use GitHub Actions, we provide a mise-action that wraps the installation of Mise and the tools. All you need to do is to add the action to your workflow:

You can use any docker image with mise installed to run your CI jobs. Here's an example using debian-slim as base image:

When configuring your job, you can cache some of the Mise directories.

An alternative is to use mise generate bootstrap to easily bootstrap mise on GitLab CI.

You can now use a generic docker image such as this one to run and install mise in CI.

Here's an example of a .gitlab-ci.yml file:

If you are using Xcode Cloud, you can use custom ci_post_clone.sh build script to install Mise. Here's an example:

**Examples:**

Example 1 (yaml):
```yaml
script: |
  curl https://mise.run | sh
  mise install
```

Example 2 (yaml):
```yaml
script: |
  mise x -- npm test
```

Example 3 (unknown):
```unknown
mise generate bootstrap -l -w
```

Example 4 (yaml):
```yaml
script: |
  ./bin/mise install
  ./bin/mise x -- npm test
```

---

## Direct age Encryption | mise-en-place

**URL:** https://mise.jdx.dev/environments/secrets/age.html

**Contents:**
- Direct age Encryption experimental ​
- Quick start ​
- CLI flags ​
- Storage format ​
- Decryption identities ​
- Defaults for recipients (encryption) ​
- Settings ​
- age.identity_files
- age.key_file
- age.ssh_identity_files

Encrypt individual environment variable values directly in mise.toml using age encryption. The age tool is not required—mise has support built-in.

This is a simple method of storing encrypted environment variables directly in mise.toml. You can use it simply by running mise set --age-encrypt <key>=<value>. By default, mise will use your ssh key (~/.ssh/id_ed25519 or ~/.ssh/id_rsa) if it exists.

It's recommended to use --prompt to avoid accidentally exposing the value to your shell history. You don't have to though, you can use mise set --age-encrypt DB_PASSWORD="password123".

If no recipients are provided explicitly, mise will try defaults (see below).

Encrypted values are stored as base64 along with a format field:

mise looks for identities in this order:

Decrypted values are always marked as redacted.

Age decryption is strict by default. If no identities are found, no available identity can decrypt the value, or the age payload is invalid, mise fails instead of continuing with a partially resolved environment.

To allow commands and tasks to continue when an age value cannot be decrypted, disable strict mode:

In non-strict mode, mise skips values that cannot be decrypted and continues resolving the rest of the environment.

When --age-encrypt is used without explicit recipients, mise attempts to derive recipients from:

If none are found, the command fails with an error asking you to provide recipients or configure settings.age.key_file.

[experimental] List of age identity files to use for decryption.

[experimental] Path to the age private key file to use for encryption/decryption.

[experimental] List of SSH identity files to use for age decryption.

If true, fail when age decryption fails (including when age is not available, the key is missing, or the key is invalid). If false, skip decryption and continue in these cases.

**Examples:**

Example 1 (sass):
```sass
mise settings set experimental=true
```

Example 2 (markdown):
```markdown
age-keygen -o ~/.config/mise/age.txt
# Note the public key output for encryption
```

Example 3 (markdown):
```markdown
mise set --age-encrypt --prompt DB_PASSWORD
# Enter value for DB_PASSWORD: [hidden input]
```

Example 4 (json):
```json
[env]
DB_PASSWORD = { age = { value = "<base64>" } }
```

---

## Sandboxing | mise-en-place

**URL:** https://mise.jdx.dev/sandboxing.html

**Contents:**
- Sandboxing ​
- Quick Start ​
- CLI Flags ​
- Task Sandboxing ​
- Implicit Access ​
  - Always Readable ​
  - Always Writable ​
  - Implicit Rules ​
- Platform Support ​
  - Linux ​

Mise supports lightweight process sandboxing for mise exec and mise run, inspired by zerobox. Sandboxing restricts filesystem, network, and environment variable access with granular controls. No Docker required, minimal overhead.

Any --deny-* or --allow-* flag implicitly enables sandboxing:

These flags work with both mise exec (mise x) and mise run.

Tasks defined in mise.toml can declare sandbox permissions:

CLI flags on mise run override task-level config:

When filesystem restrictions are active, certain paths remain accessible so tools can function:

Filesystem sandboxing uses Landlock (available since Linux 5.13). Network sandboxing uses seccomp-bpf to block inet socket creation while allowing Unix sockets.

If Landlock is unavailable or cannot apply filesystem restrictions, the command fails.

Limitation: Per-host network filtering (--allow-net=<host>) is not supported on Linux in v1. On Linux, --allow-net falls back to allowing all network access. This works on macOS via Seatbelt.

Uses Apple's sandbox-exec (Seatbelt) with a generated profile. Supports all features including per-host network filtering.

Sandboxing is not currently supported on Windows. A warning is printed and the command runs unsandboxed.

**Examples:**

Example 1 (sass):
```sass
# Full lockdown — no writes, no network, no env vars
mise x --deny-all -- node script.js

# Block network only
mise x --deny-net -- npm run build

# Block writes except to ./dist
mise x --allow-write=./dist -- npm run build

# Block everything, allow specific exceptions
mise x --deny-all --allow-read=. --allow-write=./dist --allow-net=registry.npmjs.org -- npm install
```

Example 2 (json):
```json
[tasks.build]
run = "npm run build"
deny_net = true
allow_write = ["./dist"]

[tasks.lint]
run = "eslint ."
deny_all = true
allow_read = ["."]

[tasks.install]
run = "npm install"
deny_all = true
allow_read = ["."]
allow_write = ["./node_modules"]
allow_net = ["registry.npmjs.org"]
```

Example 3 (sass):
```sass
# Run with task's declared sandbox
mise run build

# Override: also allow network to a specific host
mise run --allow-net=registry.npmjs.org build
```

Example 4 (unknown):
```unknown
mise x --deny-write -- bash untrusted-script.sh
```

---

## Configuration | mise-en-place

**URL:** https://mise.jdx.dev/configuration.html

**Contents:**
- Configuration ​
- mise.toml ​
- Configuration Hierarchy ​
  - How Configuration Merging Works ​
  - Configuration Resolution Process ​
  - Visual Configuration Hierarchy ​
  - Merge Behavior by Section ​
  - Target File for Write Operations ​
  - [tools] - Dev tools ​
  - [env] - Arbitrary Environment Variables ​

Learn how to configure mise for your project with mise.toml files, environment variables, and various configuration options to manage your development environment.

mise.toml is the config file for mise. They can be at any of the following file paths (in order of precedence, top overrides configuration of lower paths):

Run mise cfg to figure out what order mise is loading files on your particular setup. This is often a lot easier than figuring out mise's rules.

mise uses a sophisticated hierarchical configuration system that merges settings from multiple sources. Understanding this hierarchy helps you organize your development environments effectively.

These files recurse upwards, so if you have a ~/src/work/myproj/mise.toml file, what is defined there will override anything set in ~/src/work/mise.toml or ~/.config/mise.toml. The config contents are merged together.

When mise needs configuration, it follows this process:

Different configuration sections merge in different ways:

Tools ([tools]): Additive with overrides

Environment Variables ([env]): Additive with overrides

Tasks ([tasks]): Completely replaced per task

Settings ([settings]): Additive with overrides

Run mise config to see what files mise has loaded in order of precedence.

When commands like mise use, mise set, or mise unuse need to write to a config file, they use the lowest precedence file in the highest precedence directory. This means:

This behavior ensures that shared configuration (mise.toml) is updated by default, while local overrides (mise.local.toml) and environment-specific configs remain untouched unless explicitly targeted.

Here is what a typical mise.toml looks like:

mise.toml files are hierarchical. The configuration in a file in the current directory will override conflicting configuration in parent directories. For example, if ~/src/myproj/mise.toml defines the following:

And ~/src/myproj/backend/mise.toml defines:

Then when inside of ~/src/myproj/backend, node will be 18, python will be 3.10, and ruby will be 3.1. You can check the active versions with mise ls --current.

You can also have environment specific config files like .mise.production.toml, see Configuration Environments for more details.

See Tools. In addition to specifying versions, each tool entry can include options such as:

See Settings for the full list of settings.

Use [plugins] to add/modify plugin shortnames. Note that this will only modify new plugin installations. Existing plugins can use any URL.

The plugin type prefix (e.g., asdf:, vfox: or vfox-backend:) is optional. If omitted, mise clones the plugin first and then detects the plugin type from the installed plugin files.

If you simply want to install a plugin from a specific URL once, it's better to use mise plugin install <NAME> <GIT_URL>. Add this section to mise.toml if you want to share the plugin location/revision with other developers in your project.

This replaces the deprecated settings.shorthands_file / MISE_SHORTHANDS_FILE mechanism: put the same shortname = "backend-or-url" entries under [plugins] instead of a separate TOML file.

[alias] has been renamed to [tool_alias] to distinguish it from [shell_alias]. The old [alias] key still works but is deprecated.

The following makes mise install node@my_custom_node install node-20.x this can also be specified in a plugin. note adding an alias will also add a symlink, in this case:

Define shell aliases that are set when entering a directory and unset when leaving:

These work similar to environment variables—they're set dynamically based on your current directory. See Shell Aliases for more details.

Specify the minimum supported version of mise required for the configuration file.

You can set a hard minimum (errors if unmet) or a soft minimum (warns and continues):

When a soft minimum is not met, mise will print a warning and (if available) show self-update instructions. When a hard minimum is not met, mise errors and shows self-update instructions.

Use min_version to communicate the oldest mise version your project supports. In general, users should keep mise up to date because mise integrates with external registries and backends that change over time. Projects and organizations should prefer a minimum version requirement over locking users to a specific mise executable; locking users to one mise version is generally discouraged. Pinning users back is like preventing apt update or brew update from refreshing package metadata: it can hide deprecation warnings and let upstream integrations drift out of date.

Mark a configuration file as a monorepo root to enable target path syntax for tasks.

See Monorepo Tasks for detailed usage and examples.

mise can be configured in ~/.config/mise/config.toml. It works like a local mise.toml, but applies to every directory.

Only a few common settings are shown here. See Settings for the full list and descriptions.

Similar to ~/.config/mise/config.toml but for all users on the system. This is useful for setting defaults for all users.

The .tool-versions file is asdf's config file and it can be used in mise just like mise.toml. It isn't as flexible so it's recommended to use mise.toml instead. It can be useful if you already have a lot of .tool-versions files or work on a team that uses asdf.

Here is an example with all the supported syntax:

See the asdf docs for more info on this file format.

Both mise.toml and .tool-versions support "scopes" which modify the behavior of the version:

mise supports "idiomatic version files" just like asdf. They're language-specific files like .node-version and .python-version. These are ideal for setting the runtime version of a project without forcing other developers to use a specific tool like mise or asdf.

They support aliases, which means you can have an .nvmrc file with lts/hydrogen and it will work in mise and nvm. Here are some of the supported idiomatic version files:

In mise, these are disabled by default, see https://github.com/jdx/mise/discussions/4345 for rationale.

There is a performance cost to having these when they're parsed as it's performed by the plugin in bin/parse-version-file. However, these are cached so it's not a huge deal. You may not even notice.

asdf called these "legacy version files". I think this was a bad name since it implies that they shouldn't be used—which is definitely not the case IMO. I prefer the term "idiomatic" version files since they are version files not specific to asdf/mise and can be used by other tools. (.nvmrc being a notable exception, which is tied to a specific tool.)

See Settings for the full list of settings.

See Tasks for the full list of configuration options.

Normally environment variables in mise are used to set settings so most environment variables are in that doc. The following are environment variables that are not settings.

A setting in mise is generally something that can be configured either as an environment variable or set in a config file.

mise can also be configured via environment variables. The following options are available:

Default (Linux): ~/.local/share/mise or $XDG_DATA_HOME/mise Default (macOS): ~/.local/share/mise or $XDG_DATA_HOME/mise Default (Windows): %LOCALAPPDATA%\mise or $XDG_DATA_HOME/mise

This is the directory where mise stores plugins and tool installs. These are not supposed to be shared across machines.

Default (Linux): ~/.cache/mise or $XDG_CACHE_HOME/mise Default (macOS): ~/Library/Caches/mise or $XDG_CACHE_HOME/mise Default (Windows): %TEMP%\mise or $XDG_CACHE_HOME/mise

This is the directory where mise stores internal cache. This is not supposed to be shared across machines. It may be deleted at any time mise is not running.

Default: std::env::temp_dir() implementation in rust

This is used for temporary storage such as when installing tools.

This is the directory where mise stores system-wide configuration. MISE_SYSTEM_DIR is also supported as a legacy alias.

Default: $MISE_CONFIG_DIR/config.toml (Usually ~/.config/mise/config.toml)

This is the path to the config file.

Use this when you want global writes, such as mise use or mise set run from $HOME, to target a different config file. MISE_DEFAULT_CONFIG_FILENAME customizes the default local config filename, not the global config path.

This customizes the default local config filename used when mise creates or looks for project config files.

This is the path which is used as {{config_root}} for the global config file.

Set to a filename to read env from a dotenv file. e.g.: MISE_ENV_FILE=.env. This searches for and loads all matching files in the current directory and parent directories. Uses dotenvy under the hood.

Set the version for a tool. For example, MISE_NODE_VERSION=20 will use node@20.x regardless of what is set in mise.toml/.tool-versions.

This is a list of paths that mise will automatically mark as trusted. They are separated according to platform conventions for the PATH environment variable: : on Unix and ; on Windows.

This is a list of paths where mise will stop searching for configuration files and file tasks. This is useful to stop mise searching for files in slow loading directories. They are separated according to platform conventions for the PATH environment variable. On most Unix platforms, the separator is : and on Windows it is ;.

These change the verbosity of mise.

You can also use MISE_DEBUG=1, MISE_TRACE=1, and MISE_QUIET=1 as well as --log-level=trace|debug|info|warn|error.

Output logs to a file.

Same as MISE_LOG_LEVEL but for the log file output level. This is useful if you want to store the logs but not have them litter your display.

Display HTTP requests/responses in the logs.

Debug and trace logs from noisy third-party crates (h2, hyper, reqwest, rustls, etc., which emit a line per HTTP/2 frame or socket read) are always dropped — they would otherwise overwhelm debug/trace output. Set this to 1 to let those logs through; it is the only way to see them, including under --log-level=trace/-vv.

Equivalent to MISE_LOG_LEVEL=warn.

Set the timeout for http requests in seconds. The default is 30.

Set to "1" to directly pipe plugin scripts to stdin/stdout/stderr. By default stdin is disabled because when installing a bunch of plugins in parallel you won't see the prompt. Use this if a plugin accepts input or otherwise does not seem to be installing correctly.

Sets MISE_JOBS=1 because only 1 plugin script can be executed at a time.

Configures the vendor_conf.d script for fish shell to automatically activate. This file is automatically used in homebrew and potentially other installs to automatically activate mise without configuring.

Defaults to enabled, set to "0" to disable.

**Examples:**

Example 1 (typescript):
```typescript
/
├── etc/mise/                         # System-wide config (highest precedence)
│   ├── conf.d/*.toml                 # System fragments, loaded alphabetically
│   ├── config.toml                   # System defaults
│   └── config.<env>.toml             # Env-specific system config (MISE_ENV or -E)
└── home/user/
    ├── .config/mise/
    │   ├── conf.d/*.toml             # User fragments, loaded alphabetically
    │   ├── config.toml               # Global user config
    │   ├── config.<env>.toml         # Env-specific user config
    │   ├── config.local.toml         # User-local overrides
    │   └── config.<env>.local.toml   # Env-specific user-local overrides
    └── work/
        ├── mise.toml                 # Work-wide settings
        └── myproject/
            ├── mise.local.toml       # Local overrides (git-ignored)
            ├── mise.toml             # Project config
            ├── mise.<env>.toml       # Env-specific project config
            ├── mise.<env>.local.toml # Env-specific project local overrides
            └── backend/
                └── mise.toml         # Service-specific config (lowest precedence)
```

Example 2 (elixir):
```elixir
# Global: node@18, python@3.11
# Project: node@20, go@1.21
# Result: node@20, python@3.11, go@1.21
```

Example 3 (sass):
```sass
# Global: NODE_ENV=development
# Project: NODE_ENV=production, API_URL=localhost
# Result: NODE_ENV=production, API_URL=localhost
```

Example 4 (markdown):
```markdown
# Global: [tasks.test] = "npm test"
# Project: [tasks.test] = "yarn test"
# Result: "yarn test" (completely replaces global)
```

---

## Hooks | mise-en-place

**URL:** https://mise.jdx.dev/hooks.html

**Contents:**
- Hooks ​
- CD hook ​
- Enter hook ​
- Leave hook ​
- Preinstall/postinstall hook ​
- Tool-level postinstall ​
- Task hooks ​
- Watch files hook ​
- Hook execution ​
- Shell hooks ​

You can have mise automatically execute scripts during a mise activate session. You cannot use these without the mise activate shell hook installed in your shell—except the preinstall and postinstall hooks. The configuration goes into mise.toml.

This hook is run anytime the directory is changed.

This hook is run when the project is entered. Changing directories while in the project will not trigger this hook again.

This hook is run when the project is left. Changing directories while in the project will not trigger this hook.

These hooks are run before and after tools are installed (respectively). Unlike other hooks, these hooks do not require mise activate.

String hooks are shorthand for run hooks. Use a hook table when you need to select the inline shell command:

Like tasks, inline hook tables may define a Windows-specific command with run_windows. On Windows, mise uses run_windows when it is set; otherwise it uses run. On other platforms, a hook with only run_windows is skipped.

For preinstall and postinstall, script = ... is a legacy alias for run = .... If a shell is also set on a script/scripts hook, mise warns that the shell is ignored and still runs the script with the default inline shell. Use run = ... with shell = "bash -c" to choose the inline shell command. The script alias for install hooks is deprecated.

A mise install that finds nothing to install (all configured tools are already present) still runs the postinstall hook — it is not skipped on a no-op install.

The postinstall hook receives a MISE_INSTALLED_TOOLS environment variable containing a JSON array of the tools that were just installed, or [] when nothing was installed (e.g. a no-op install). Hooks that should only act on real installs can guard on MISE_INSTALLED_TOOLS != "[]":

Individual tools can define their own postinstall scripts using the postinstall option. These run immediately after each tool is installed (before other tools in the same session are installed):

Tool-level postinstall scripts receive the following environment variables:

Instead of inline scripts, hooks can reference mise tasks. The task is executed as a subprocess via mise run, so it reuses the full task system including dependencies, environment variables, and file-based task definitions.

You can mix task references with inline scripts in arrays:

Task hooks work with all hook types (enter, leave, cd, preinstall, postinstall).

While using mise activate you can have mise watch files for changes and execute a script or task when a file changes.

By default, run uses the configured inline shell: unix_default_inline_shell_args or windows_default_inline_shell_args. Add shell = "bash -c" to choose a different inline shell command for a watch file hook:

shell only applies to run hooks. You can also reference a mise task instead of an inline script:

Each [[watch_files]] entry should have either run or task, but not both.

This hook will have the following environment variables set:

Hooks are executed with the following environment variables set:

Inline run hooks can be written as { run = "..." } for any hook type. The string shorthand (enter = "echo hi") is equivalent to { run = "echo hi" }.

run and run_windows must be strings. run = ["echo one", "echo two"] is not supported.

To run separate spawned inline commands, define multiple hooks. Each hook entry is a separate execution, so mise starts one subprocess per run entry:

To run multiple shell lines in one spawned command, use one multiline run string. This is one hook execution and one subprocess:

run hooks execute in a subprocess using the default inline shell: unix_default_inline_shell_args or windows_default_inline_shell_args. Add shell = "bash -c" to a run hook table to choose a different inline shell command. Like task shell, the value should include both the program and the argument that evaluates the inline command such as bash -c, zsh -c, or pwsh -Command.

enter, leave, and cd hooks can be executed in the current shell, for example if you'd like to add bash completions when entering a directory:

Current-shell hooks may use script/scripts arrays:

script with shell is for current-shell hooks. Here, shell is a shell-name selector such as bash, zsh, or fish, not an inline shell command like bash -c. mise only prints the script when the active mise activate shell matches.

Use run when the hook should execute as an inline command in a subprocess. preinstall and postinstall do not have a current shell, so script is only kept there as a legacy alias for run; if shell is set with script/scripts on those hooks, it is ignored.

I feel this should be obvious but in case it's not, this isn't going to do any sort of cleanup when you leave the directory like using [env] does in mise.toml. You're literally just executing shell code when you enter the directory which mise has no way to track at all. I don't think there is a solution to this problem and it's likely the reason direnv has never implemented something similar.

I think in most situations this is probably fine, though worth keeping in mind.

You can use arrays to define multiple hooks in the same file:

**Examples:**

Example 1 (json):
```json
[hooks]
cd = "echo 'I changed directories'"
```

Example 2 (json):
```json
[hooks]
enter = "echo 'I entered the project'"
```

Example 3 (json):
```json
[hooks]
leave = "echo 'I left the project'"
```

Example 4 (json):
```json
[hooks]
preinstall = "echo 'I am about to install tools'"
postinstall = "echo 'I just installed tools'"
```

---

## Secrets | mise-en-place

**URL:** https://mise.jdx.dev/environments/secrets/

**Contents:**
- Secrets ​

Use mise to manage sensitive environment variables securely. There are multiple supported approaches:

---

## Tips & Tricks | mise-en-place

**URL:** https://mise.jdx.dev/tips-and-tricks.html

**Contents:**
- Tips & Tricks ​
- macOS Rosetta ​
- Shebang ​
- Bootstrap script ​
- Project-local task entrypoints ​
- Machine bootstrapping experimental ​
- Installation via zsh zinit ​
- CI/CD ​
  - GitHub Actions ​
- mise set ​

An assortment of helpful tips for using mise.

If you have a need to run tools as x86_64 on Apple Silicon, this can be done with mise however you'll currently need to use the x86_64 version of mise itself. A common reason for doing this is to support compiling node <=14.

You can do this either with the MISE_ARCH setting or by using a dedicated rosetta mise bin as described below:

First, you'll need a copy of mise that's built for x86_64:

If ~/.local/bin is not in PATH, you'll need to prefix all commands with ~/.local/bin/mise-x64.

Now you can use mise-x64 to install tools:

You can specify a tool and its version in a shebang without needing to first set up a mise.toml/.tool-versions config:

This can also be useful in environments where mise isn't activated (such as a non-interactive session).

You can download the https://mise.run script to use in a project bootstrap script:

This file contains checksums so it's more secure to commit it into your project rather than calling curl https://mise.run dynamically—though of course this means it will only fetch the version of mise that was current when the script was created.

If you want contributors to run project tasks without installing mise first, pair mise generate bootstrap with mise generate task-stubs:

The generated task stubs behave like small project commands, while bin/mise downloads and runs the pinned mise binary for the project.

Beyond [tools], mise can declare the rest of the machine setup needed for a project or workstation, and mise bootstrap converges it in one command — system packages, then repos, then dotfiles, then shell activation, then macOS defaults, then LaunchAgents, then systemd user services, then login shell, then tools, then a bootstrap task if you define one:

Everything is declarative and idempotent: re-running skips whatever is already in its desired state, mise bootstrap packages status --missing and mise bootstrap dotfiles status --missing make CI checks, and nothing is ever applied implicitly. The exceptions are [bootstrap.hooks] and [tasks.bootstrap], which are imperative commands run during mise bootstrap and may have side effects; treat hook commands as non-idempotent unless they are written to converge safely. See Bootstrap, Bootstrap Packages, Repos, Dotfiles, Shell Activation, macOS Defaults, launchd, systemd, and User Login Shell.

Zinit is a plugin manager for ZSH, which this snippet you will get mise (and usage for shell completion):

Using mise in CI/CD is a great way to synchronize tool versions for dev/build.

mise is pretty easy to use without an action:

Or you can use the custom action jdx/mise-action:

Instead of manually editing mise.toml to add env vars, you can use mise set instead:

Some project-local version files are already supported as idiomatic version files. For other version files, you can use Tera templates in mise.toml to read the file and assign the version to the appropriate tool.

For example, to use a .hvm file with a plain Hugo version:

HVM also supports versions with an /extended suffix. In mise, Hugo and Hugo Extended are separate tools, so strip the suffix and use hugo-extended instead:

See Templates for more details on Tera functions and filters.

As long as the task name doesn't conflict with a mise-provided command you can skip the run part:

Don't do this inside of scripts because mise may add a command in a future version and could conflict with your task.

mise watch reruns tasks when files change. It uses watchexec, which you can install globally with mise:

Use --restart for long-running processes that should restart on changes:

For projects with a lot of tasks, task_config.includes can load task definitions from additional directories, tasks.toml files, or remote git repositories:

Included tasks.toml files use the same shape as the [tasks] table without the [tasks.] prefix.

Experimental task templates let multiple tasks share common tools, environment variables, and command defaults:

This is especially useful in monorepos where each package needs similar build, test, or lint tasks with small local overrides.

If a task may echo secrets in CI logs, add redactions to the task or config. The listed environment variables are replaced with [redacted] in task output:

Glob patterns are also supported:

See Security for mise's software verification controls, including aqua signatures, SLSA provenance, and GitHub artifact attestations.

See Security for supply-chain delay controls, backend support, and transitive dependency filtering behavior.

Use mise up --bump to upgrade all software to the latest version and update mise.toml files. This keeps the same semver range as before, so if you had node = "24" and node 26 is the latest, mise up --bump node will change mise.toml to node = "26".

cargo-binstall is sort of like ubi but specific to rust tools. It fetches binaries for cargo releases. mise will use this automatically for cargo: tools if it is installed so if you use cargo: you should add this to make mise i go much faster.

mise caches things for obvious reasons but sometimes you want it to use fresh data (maybe it's not noticing a new release). Run mise cache clear to remove the cache which basically just run rm -rf ~/.cache/mise/*.

mise en is a great alternative to mise activate if you don't want to always be using mise for some reason. It sets up the mise environment in your current directory but doesn't keep running and updating the env vars after that.

Auto-install tools when entering a project by adding the following to mise.toml:

Get information about what backend a tool is using and other information with mise tool [TOOL]:

List the config files mise is reading in a particular directory with mise cfg:

This is helpful figuring out which order the config files are loaded in to figure out which one is overriding.

When lockfiles are enabled, mise will update mise.lock with full versions and tarball checksums (if supported by the backend). These can be updated with mise up. You need to manually create the lockfile, then mise will add the tools to it:

The lockfile uses a consolidated format with [tools.name.assets] sections to organize asset information under each tool. Asset information includes checksums, file sizes, and optional download URLs. Legacy lockfiles with separate [tools.name.checksums] and [tools.name.sizes] sections are automatically migrated to the new format.

Note that at least currently mise needs to actually install the tool to get the tarball checksum (otherwise it would need to download the tarball just to get the checksum of it since normally that gets deleted). So you may need to run something like mise uninstall --all first in order to have it reinstall everything. It will store the full versions even if it doesn't know the checksum though so it'll still lock the version just not have a checksum to go with it.

When you use a lockfile (mise.lock), mise stores the exact download URLs for each tool asset. This means that after the initial install, future mise install runs will use the URLs from the lockfile instead of making API calls to GitHub (or other providers). This has several benefits:

This is especially useful in CI/CD or when working in environments with strict network or authentication requirements.

**Examples:**

Example 1 (sass):
```sass
$ curl https://mise.run | MISE_INSTALL_PATH=~/.local/bin/mise-x64 MISE_INSTALL_ARCH=x64 sh
$ ~/.local/bin/mise-x64 --version
mise 2024.x.x
```

Example 2 (elixir):
```elixir
mise-x64 use -g node@20
```

Example 3 (elixir):
```elixir
#!/usr/bin/env -S mise x node@20 -- node
// "env -S" allows multiple arguments in a shebang
console.log(`Running node: ${process.version}`);
```

Example 4 (sass):
```sass
curl https://mise.run > setup-mise.sh
chmod +x setup-mise.sh
./setup-mise.sh
```

---

## Contributing | mise-en-place

**URL:** https://mise.jdx.dev/contributing.html

**Contents:**
- Contributing ​
- Contribution Expectations ​
- Pull Request Checklist ​
  - Development Tips ​
- Packaging and Self-Update Instructions ​
- Testing ​
  - Unit Tests ​
  - E2E Tests ​
  - Coverage Tests ​
  - Windows E2E Tests ​

mise has a specific scope and design taste. Before opening a PR, unless it is something obvious, start a discussion or mention what you plan to do in Discord. The important part is to settle the direction before much implementation or review happens. PRs are often either rejected or need to change significantly after submission, so make sure the idea fits before you invest too much time.

Before I review a PR, CI must be passing, the PR title must follow Conventional Commits, and all automated AI review comments must be addressed. If any of those are still open, assume I will wait to look at the PR.

If I am on the fence about a contribution, I will probably reject it for that reason alone. If I did not do this, mise would suffer from feature bloat. I may also reject a PR if the quality is poor enough that I do not have confidence the contributor can get it across the finish line. I do not have time to coach contributors.

I get hundreds of PRs per week across my projects, so I do not have time to respond to every PR with detailed context. A rejection may be brief.

When mise is installed via a package manager, in-app self-update is disabled and users should update via their package manager. Packaging should install a TOML file with platform-specific instructions at lib/mise-self-update-instructions.toml (or lib/mise/mise-self-update-instructions.toml). Example contents:

mise has a comprehensive test suite with multiple types of tests to ensure reliability and functionality across different platforms and scenarios.

Unit tests are fast, focused tests for individual components and functions:

End-to-end tests validate the complete functionality of mise in realistic scenarios:

Coverage tests measure how much of the codebase is covered by tests:

Windows has its own test suite written in PowerShell:

Test plugin functionality across different backends:

Tests run in isolated environments to avoid conflicts:

The E2E tests use a custom assertion framework (e2e/assert.sh):

Used for testing output consistency:

Create a development shim to easily run mise during development:

Then use @mise to run the development version:

Use mise tasks to see all available development tasks:

Shouldn't require anything special I'm aware of, but mise run build is a good sanity check to run and make sure it's all working.

mise uses hk as its git hook manager for linting and code quality checks. hk is a modern alternative to lefthook written by the same author as mise.

The project uses hk.pkl (written in the Pkl configuration language) to define linting rules:

I use the following shim in ~/.local/bin/@mise:

Don't forget to change the manifest path to the correct path for your setup.

Then if that is in PATH just use @mise to run mise by compiling it on the fly.

Run mise run release -x [minor|patch]. (minor if it is the first release in a month)

mise uses several tools to validate dependencies and code quality:

These checks run automatically in CI and can be run locally:

mise uses Conventional Commits for consistent commit messages and automated changelog generation. All commits should follow this format:

Common scopes used in mise:

Breaking changes are rarely accepted into mise and are only performed in exceptional situations where there is no better alternative. When a breaking change is necessary, the process includes:

For breaking changes, add ! after the type or include BREAKING CHANGE: in the footer:

mise uses several automated workflows to maintain code quality and streamline development:

To add a new setting, add it to settings.toml in the root of the project and run mise run render to update the codebase.

Adding tools to mise involves adding entries to the registry/ file. This allows users to install tools using short names like mise use ripgrep instead of the full backend specification.

Choose the right backend for your tool:

Test the tool works properly with mise test-tool your-tool

When adding a new tool, the following requirements apply (automatically enforced by GitHub Actions workflow):

Which backend you choose for a registry entry matters as much as which tool you add. Backends fall into the following tiers:

Tier 1 — preferred, routinely accepted: aqua, github, and gitlab.

Tier 2 — high bar, but lower than tier 3: conda.

Potentially accepted for tools that can't reasonably be supported via aqua/github. The bar is lower than tier 3 because mise's conda backend does not require a separately-installed package manager — packages are downloaded and extracted directly from anaconda.org, with no conda/mamba/micromamba needed on the user's PATH. The tool still needs to be popular and well-maintained.

Tier 3 — very high bar, rarely accepted: npm, pipx, gem, cargo, go, dotnet.

These all depend on a separately-installed runtime or toolchain being present on the user's PATH (node, python, ruby, cargo, go, dotnet), which is fragile — npm/pipx/gem in particular silently bind tools to whichever node/python/ruby happened to be on PATH at install time, which breaks when versions change or the runtime isn't installed. Accepted only when no aqua/github option exists and the tool is widely used. Discuss with @jdx before submitting.

Not accepted: asdf, vfox, ubi.

Users can still install via any backend themselves with explicit syntax (mise use vfox:owner/repo, mise use cargo:name, etc.) — they just don't get a registry shorthand for it.

The registry/ file uses this format:

List backends in order of preference. Users will get the first available backend, but can override with explicit syntax like mise use aqua:owner/repo. Only include npm as a fallback for a tool that already has a non-npm primary backend when the npm package works with lifecycle scripts disabled.

All tools must include a test to verify proper installation:

The test command should be reliable and the output pattern should use {{version}} to match any version number.

If test.cmd needs extra mise-managed tools on PATH, declare them with test.tools. This is used only by mise test-tool; it does not affect normal tool installation.

Recent tool additions:

DuckDB: Simple github backend (#4248)

Biome: Multiple backends (#4283)

Backend vs Tool Confusion

Most contributors want to add tools, not backends. Before reading this section, make sure you actually need a new backend. Tools are individual software packages (like node or ripgrep), while backends are installation mechanisms (like aqua or github). If you want to add a specific tool to mise, see Adding Tools instead.

Core Backend Acceptance Policy

New backends are unlikely to be accepted into mise core. They require a lot of maintenance so it's generally better to use the backend plugin system to add backends without core changes. A new backend would only be accepted for a major package manager or tool that would greatly enhance mise's capabilities.

If you need a custom backend:

Most tool installation needs can be met by existing backends, especially github for GitHub releases and aqua for comprehensive package management.

Backends are mise's abstraction for different tool installation methods. Each backend implements the Backend trait to provide consistent functionality across different installation systems.

Create the backend module in src/backend/ (e.g., my_backend.rs)

Implement the Backend trait:

Register the backend in src/backend/mod.rs:

Add CLI argument parsing in src/cli/args/backend_arg.rs if needed

Update the registry in registry/ if it should be available as a shorthand

Look at existing backends for patterns:

For detailed architecture information, see Backend Architecture.

This is only necessary to test if actually changing the packaging setup.

This is for arm64, but you can change the arch to amd64 if you want.

**Examples:**

Example 1 (sql):
```sql
# Debian/Ubuntu (APT)
message = "To update mise from the APT repository, run:\n\n  sudo apt update && sudo apt install --only-upgrade mise\n"
```

Example 2 (sql):
```sql
# Fedora/CentOS Stream (DNF)
message = "To update mise from COPR, run:\n\n  sudo dnf upgrade mise\n"
```

Example 3 (markdown):
```markdown
# Run all unit tests
cargo test --all-features

# Run specific unit tests
cargo test <test_name>
```

Example 4 (sass):
```sass
# Run all E2E tests
mise run test:e2e

# Run specific E2E test
./e2e/run_test test_name

# Run E2E tests matching pattern
./e2e/run_test task  # runs tests matching *task*

# Run all tests including slow ones
TEST_ALL=1 mise run test:e2e
```

---

## Mise + Terraform/Opentofu Cookbook | mise-en-place

**URL:** https://mise.jdx.dev/mise-cookbook/terraform.html

**Contents:**
- Mise + Terraform/Opentofu Cookbook ​
- Managing terraform/opentofu Projects ​

Here are some tips on managing Terraform projects with mise.

It is often necessary to have your terraform configuration in a terraform/ subdirectory. This necessitates the use of syntax like terraform -chdir=terraform plan to use appropriate terraform command. The following config allows you to invoke all of them from mise, leveraging mise tasks.

**Examples:**

Example 1 (sass):
```sass
[tools]
terraform = "1"

[tasks."terraform:init"]
description = "Initializes a Terraform working directory"
run = "terraform -chdir=terraform init"

[tasks."terraform:plan"]
description = "Generates an execution plan for Terraform"
run = "terraform -chdir=terraform plan"

[tasks."terraform:apply"]
description = "Applies the changes required to reach the desired state of the configuration"
run = "terraform -chdir=terraform apply"

[tasks."terraform:destroy"]
description = "Destroy Terraform-managed infrastructure"
run = "terraform -chdir=terraform destroy"

[tasks."terraform:validate"]
description = "Validates the Terraform files"
run = "terraform -chdir=terraform validate"

[tasks."terraform:format"]
description = "Formats the Terraform files"
run = "terraform -chdir=terraform fmt"

[tasks."terraform:check"]
description = "Checks the Terraform files"
depends = ["terraform:format", "terraform:validate"]

[env]
_.file = ".env"
```

---

## mise Architecture | mise-en-place

**URL:** https://mise.jdx.dev/architecture.html

**Contents:**
- mise Architecture ​
- System Overview ​
- Core Architecture Components ​
  - Command Layer (src/cli/) ​
  - Backend System (src/backend/) ​
  - Configuration System (src/config/) ​
  - Toolset Management (src/toolset/) ​
  - Task System (src/task/) ​
  - Plugin System (src/plugins/) ​
  - Shell Integration (src/shell/) ​

This document provides a comprehensive overview of mise's architecture, designed primarily for contributors and those interested in understanding how mise works internally.

For practical development guidance, see the Contributing Guide.

mise is a Rust-based tool with a modular architecture centered around three core concepts:

These three pillars work together to provide a unified development environment management experience.

The CLI layer provides the user interface and delegates to core functionality:

Key Commands Architecture:

The backend system is mise's core abstraction for tool management, implementing a trait-based architecture:

For guidance on implementing new backends, see the Contributing Guide. For detailed backend system design, see Backend Architecture.

A hierarchical configuration system that merges settings from multiple config files:

Config Trait Architecture:

Concrete Implementations:

Configuration Hierarchy: See Configuration Documentation for the complete hierarchy and precedence rules.

Coordinates tool resolution, installation, and environment setup:

Tool Resolution Pipeline:

Sophisticated task execution with dependency graph management:

Architecture Components:

Dependency Resolution:

See the Task Documentation for complete usage details and configuration options, and Task Architecture for detailed system design.

Extensibility layer supporting multiple plugin architectures:

For complete plugin documentation, see Plugin Guide.

Shell-specific code generation that abstracts commands like mise env and contains all shell differences in one place:

Supported Shells: See mise activate documentation for the complete list Shell Abstractions: Environment variable setting, PATH modification, command execution

Helpers for working with environment variables:

For environment setup and configuration, see Environment Documentation.

Generic caching backed by files, using msgpack serialization with zstd compression:

mise employs a multi-layered testing strategy that combines different testing approaches for thorough validation across its complex feature set.

Testing Strategy Overview:

Most tests in mise are end-to-end tests, and this is generally the preferred approach for new functionality. E2E tests provide thorough validation of real-world usage scenarios and catch integration issues that unit tests might miss. However, E2E tests can be challenging to run locally due to environment dependencies and setup complexity. For development and CI purposes, it's often easier to run tests on GitHub Actions where the environment is consistent and properly configured.

See the Contributing Guide for detailed testing setup and guidelines.

Structure and Characteristics:

Test Environment Setup:

Environment Isolation System:

Each test runs in complete isolation with temporary directories:

Rich Assertion Framework:

The assert.sh provides rich test utilities:

Windows-Specific Tests (e2e-win/):

Performance and Utility Tests (xtasks/test/):

Test Data Management (test/):

Test Execution Modes:

Developer Experience Features:

For complete development setup and testing procedures, see the Contributing Guide.

This robust test architecture ensures mise's reliability across its complex feature set, including tool management, environment configuration, task execution, and multi-platform support.

For deeper understanding of specific subsystems:

**Examples:**

Example 1 (rust):
```rust
pub trait Backend: Debug + Send + Sync {
    async fn list_remote_versions(&self, config: &Arc<Config>) -> Result<Vec<String>>;
    async fn install_version(&self, ctx: &InstallContext, tv: ToolVersion) -> Result<ToolVersion>;
    async fn uninstall_version(&self, tv: &ToolVersion) -> Result<()>;
    // ... additional methods for lifecycle management
}
```

Example 2 (rust):
```rust
pub trait ConfigFile: Debug + Send + Sync {
    fn get_path(&self) -> &Path;
    fn to_tool_request_set(&self) -> Result<ToolRequestSet>;
    fn env_entries(&self) -> Result<Vec<EnvDirective>>;
    fn tasks(&self) -> Vec<&Task>;
    // ... additional configuration methods
}
```

Example 3 (rust):
```rust
pub trait Plugin: Debug + Send {
    fn name(&self) -> &str;
    fn path(&self) -> PathBuf;
    async fn install(&self, config: &Arc<Config>, pr: &dyn SingleReport) -> Result<()>;
    async fn update(&self, pr: &dyn SingleReport, gitref: Option<String>) -> Result<()>;
    // ... lifecycle management methods
}
```

Example 4 (rust):
```rust
pub trait Shell: Display {
    fn activate(&self, opts: ActivateOptions) -> String;
    fn set_env(&self, k: &str, v: &str) -> String;
    fn unset_env(&self, k: &str) -> String;
    // ... shell-specific methods
}
```

---

## IDE Integration | mise-en-place

**URL:** https://mise.jdx.dev/ide-integration.html

**Contents:**
- IDE Integration ​
- Adding shims to PATH in your default shell profile ​
- IDE Plugins ​
- Vim ​
- Neovim ​
- emacs ​
  - Traditional shims way ​
  - Use with package mise.el ​
- JetBrains Editors (IntelliJ, RustRover, PyCharm, WebStorm, RubyMine, GoLand, etc) ​
  - IntelliJ Plugin ​

Code editors and IDEs work differently than interactive shells.

Usually, they will either inherit the environment from your current shell (this is the case if you start it from a terminal like nvim . or code .) or will have their own way to set up the environment.

Once you have launched the IDE, it won't reload the environment variables or the PATH provided by mise if you update your mise configuration files. Therefore, we cannot rely on the default mise activate method to automatically set up the editor.

There are a few ways to make mise work with your editor:

IDEs work better with shims than they do environment variable modifications. The simplest way is to add the mise shim directory to PATH.

For IntelliJ and VSCode—and likely others, you can modify your default shell's login (aka "profile") script. Your default shell can be found with:

You can change your default shell with chsh -s /path/to/shell but you may need to first add it to /etc/shells. Once you know the right one, modify the appropriate file:

Do not use /bin/bash or /usr/bin/bash on macOS. bash is complicated, decades old, and mise isn't able to use as many features. Unless you consider yourself an expert on bash and know why I (and Apple for that matter) admonish using bash, just use zsh on macOS.

On Linux this is read when logging into the machine, so changing it requires logging out and back in for it to work. See VSCode below for how to get VSCode to read the login file.

This assumes that mise is on PATH. If it is not, you'll need to use the absolute path ( e.g.: eval "$($HOME/.local/bin/mise activate zsh --shims)").

Here is an example showing that VSCode will use node provided by mise:

As mentioned above, using shims doesn't work with all mise features. For example, arbitrary env vars in [env] will only be set if a shim is executed. For this we need tighter integration with the IDE and/or a custom plugin.

Here are some community plugins that have been developed to work with mise:

For a better Treesitter and LSP integration, check out the neovim cookbook.

https://github.com/eki3z/mise.el

A GNU Emacs library which uses the mise tool to determine per-directory/project environment variables and then set those environment variables on a per-buffer basis.

https://github.com/134130/intellij-mise

This plugin can automatically configure the IDE to use the tools provided by mise. It has also some support for running mise tasks and loading environment variables in the run configurations.

Some JetBrains IDEs (or language plugins) have direct support for mise. This allows you to select the SDK version from the IDE settings. Example for Java:

Some plugins cannot find SDK installed by mise yet but might have support for asdf. In that case, a workaround is to symlink the mise tool directory which has same layout as asdf:

Then they should show up on in Project Settings:

Or in the case of node (possibly other languages), it's under "Languages & Frameworks":

Unlike Linux, macOS does not read the login shell profile (~/.profile, or ~/.zprofile) when logging into the machine. You'll likely want to add this setting to VSCode config in order to have it load your shims:

You can also use ["--login", "--interactive"] if you want to include ~/.zshrc.

There is a VSCode plugin which can configure other extensions for you, without having to modify your shell profile to add the shims to PATH.

In addition, it provides additional features such as:

https://github.com/hverlin/mise-vscode/ (Documentation)

While modifying your default shell profile is likely the easiest solution, you can also set the tools in launch.json:

Xcode projects can run system commands from script build phases and schemes. Since Xcode sandboxes the execution of the script using the tool /usr/bin/sandbox-exec, don't expect Mise and the automatically-activated tools to work out of the box. First, you'll need to add $(SRCROOT)/mise.toml to the list of Input files. This is necessary for Xcode to allow reads to that file. Then, you can use mise activate to activate the tools you need:

**Examples:**

Example 1 (bash):
```bash
dscl . -read /Users/$USER UserShell
```

Example 2 (bash):
```bash
getent passwd $USER | cut -d: -f7
```

Example 3 (markdown):
```markdown
# ~/.zprofile
eval "$(mise activate zsh --shims)"
```

Example 4 (markdown):
```markdown
# ~/.bash_profile or ~/.bash_login or ~/.profile
eval "$(mise activate bash --shims)"
```

---

## Errors | mise-en-place

**URL:** https://mise.jdx.dev/errors.html

**Contents:**
- Errors ​
- Config files in <dir> are not trusted. Trust them with mise trust. ​
- <tool> not found in mise tool registry ​
- Failed to install <tool>@<version>: <underlying error> ​
- <tool>@<version> not installed ​
- [<config file>] <tool>@<version>: <error> (failed to resolve version) ​
- HTTP status client error (403 Forbidden) / GitHub rate limit exceeded ​
- Checksum mismatch for file <file> ​
- mise version <X> is required, but you are using <Y> ​
- no tasks <name> found ​

This page lists common error messages mise emits, what causes them, and how to fix them. It complements Troubleshooting, which is organized by symptom (wrong tool version, slow prompts, activation issues) rather than by error message.

Every error is followed by a generic footer like this:

The actual error is the line(s) above the footer. To get more detail on any error:

mise found a config file (mise.toml, .tool-versions, etc.) in a directory you haven't marked as trusted. Config files can define environment variables, templates, and tasks, so mise won't load them from unfamiliar directories until you approve them.

Run mise trust in the directory to trust it. To trust a whole tree of projects (e.g. everything under ~/src), use the trusted_config_paths setting. See also paranoid mode for stricter behavior.

The tool name you used has no shorthand in the registry. If the error includes a "Did you mean?" list, check for a typo first.

If the tool genuinely isn't in the registry, you can still install it by specifying the backend explicitly:

See backends for all options. The registry only provides short names for popular tools — any tool can be installed with explicit backend syntax.

A wrapper around whatever actually went wrong during installation — the text after the colon is the real error, so start there (it's often one of the other errors on this page, like a 403 or checksum mismatch). If it's unclear, re-run with --verbose to see the full output, or use mise install <tool>@<version> --raw to run the install serially with stdin/stdout connected to your terminal.

The requested version is known to mise but not installed on disk. Run mise install (or mise install <tool>@<version>) to install it. mise ls <tool> shows which versions are installed vs. merely requested by config files.

mise could not resolve the version requested by the named config file — for example [~/src/proj/mise.toml] node@99 when no such version exists. Common causes:

You've hit GitHub's API rate limit, which is very low for unauthenticated requests. This is especially common in CI. If no token is configured, mise prints a warning telling you so.

Set a GitHub token (no scopes required) as GITHUB_TOKEN or MISE_GITHUB_TOKEN in your environment — see GitHub Tokens for all supported token sources. If a token is set, verify it's valid and has access to the repository (private repos need appropriate scopes).

The error output includes github auth: and github rate limit: lines to help diagnose which case you're in.

The downloaded file doesn't match the expected checksum from the lockfile, the aqua registry, or the tool's published checksums. Causes, in rough order of likelihood:

The project's config file declares a min_version newer than your installed mise. Update mise with mise self-update (if installed via the standalone installer) or through the package manager you installed it with.

No task with that name is defined in the current config hierarchy. Run mise tasks ls to see available tasks — note that tasks are loaded from config files in the current directory and its parents, so a task defined in another project directory won't be visible.

These mean a command mise executed failed — a task, a plugin script, or the program run via mise exec/shims. The problem is in the command, not mise itself; mise propagates the command's exit code. Re-run with --verbose (or MISE_DEBUG=1) to see the command's full output if it isn't already shown.

**Examples:**

Example 1 (sass):
```sass
mise ERROR Version: 2026.7.0
mise ERROR Run with --verbose or MISE_VERBOSE=1 for more information
```

Example 2 (sass):
```sass
mise --verbose <command>    # or MISE_VERBOSE=1 — show stacktraces and command output
MISE_DEBUG=1 mise <command> # debug logging
MISE_TRACE=1 mise <command> # trace logging (very verbose)
mise doctor                 # diagnostics and warnings about your setup
```

Example 3 (elixir):
```elixir
mise use aqua:owner/repo     # if it's in the aqua registry
mise use github:owner/repo   # GitHub releases
mise use cargo:some-tool     # crates.io
mise use npm:some-tool       # npm
```

Example 4 (lua):
```lua
Checksum mismatch for file node-v24.0.0.tar.gz:
Expected: sha256:abc123...
Actual:   sha256:def456...
```

---

## Tool Plugin Development | mise-en-place

**URL:** https://mise.jdx.dev/tool-plugin-development.html

**Contents:**
- Tool Plugin Development ​
- What are Tool Plugins? ​
- Plugin Architecture ​
- Hook Functions ​
  - Required Hooks ​
    - Available Hook ​
      - Rolling Releases ​
    - PreInstall Hook ​
    - EnvKeys Hook ​
  - Optional Hooks ​

The mise-tool-plugin-template provides a ready-to-use starting point with LuaCATS type definitions, stylua formatting, and hk linting pre-configured.

Tool plugins use a hook-based architecture to manage individual tools. They are compatible with the standard vfox ecosystem and are perfect for tools that need complex installation logic, environment configuration, or legacy file parsing.

Tool plugins use traditional hook functions to manage a single tool. They provide:

Tool plugins are implemented in Lua (version 5.1 at the moment). They use a hook-based architecture with specific functions for different lifecycle events:

These hooks must be implemented for a functional plugin:

Lists all available versions of the tool:

For tools that have rolling releases like "nightly" or "stable" where the version string stays the same but the content changes, you can mark versions as rolling and provide a checksum for update detection:

When rolling = true is set:

The checksum should be the SHA256 hash of the release asset for the user's platform. See the vfox-neovim plugin for a complete example.

Handles pre-installation logic and returns download information:

Configures environment variables for the installed tool:

These hooks provide additional functionality:

Performs additional setup after installation:

Modifies version before use:

Parses version files from other tools:

The easiest way to create a new tool plugin is to use the mise-tool-plugin-template repository as a starting point:

The template includes:

Create a directory with this structure (or use the template above):

Configure plugin metadata and legacy file support:

Add depends to the PLUGIN table when install hooks need other mise-managed tools on PATH. Use tool names as they would appear in mise.toml, for example depends = { "go", "make" }. Omit it if hooks do not shell out to other tools.

This is separate from depends in [tools], which only makes one configured tool wait for another configured tool in the install graph. vfox metadata.lua depends is plugin metadata; when matching tools are configured, mise uses it to order current install jobs and to build the hook environment.

Create shared functions in the lib/ directory:

Here's a complete example based on the vfox-nodejs plugin that demonstrates all the concepts:

If you're using the template repository, you can run the included tests:

Use debug mode to see detailed plugin execution:

Create a comprehensive test script:

Always provide meaningful error messages:

Handle different operating systems properly using the RUNTIME object:

Note: The RUNTIME object is automatically available in all plugin hooks and provides:

Normalize versions consistently:

Cache expensive operations:

Different installation logic based on platform or version:

For plugins that need to compile from source:

Complex environment variable setup:

**Examples:**

Example 1 (lua):
```lua
-- hooks/available.lua
function PLUGIN:Available(ctx)
    local args = ctx.args  -- User arguments

    -- Return array of available versions
    return {
        {
            version = "20.0.0",
            note = "Latest"
        },
        {
            version = "18.18.0",
            note = "LTS",
            addition = {
                {
                    name = "npm",
                    version = "9.8.1"
                }
            }
        }
    }
end
```

Example 2 (lua):
```lua
function PLUGIN:Available(ctx)
    return {
        {
            version = "nightly",
            note = "Latest development build",
            rolling = true,  -- Mark as rolling release
            checksum = "abc123..."  -- SHA256 of the release asset
        },
        {
            version = "stable",
            note = "Latest stable release",
            rolling = true,
            checksum = "def456..."
        },
        {
            version = "1.0.0",
            note = "Fixed release"
            -- No rolling or checksum needed for fixed versions
        }
    }
end
```

Example 3 (lua):
```lua
-- hooks/pre_install.lua
function PLUGIN:PreInstall(ctx)
    local version = ctx.version
    local runtimeVersion = ctx.runtimeVersion

    -- Determine download URL and checksums
    local url = "https://nodejs.org/dist/v" .. version .. "/node-v" .. version .. "-linux-x64.tar.gz"

    return {
        version = version,
        url = url,
        sha256 = "abc123...",  -- Optional checksum
        note = "Installing Node.js " .. version,
        -- Optional attestation metadata, choose a verification type
        attestation = {
            -- GitHub
            github_owner = "ownername"
            github_repo = "reponame"
            -- Cosign
            cosign_sig_or_bundle_path = "/path/to/sig/or/bundle/file"
            -- SLSA
            slsa_provenance_path = "/path/to/provenance/file"
        },
        -- Additional files can be specified
        addition = {
            {
                name = "npm",
                url = "https://registry.npmjs.org/npm/-/npm-" .. npm_version .. ".tgz"
            }
        }
    }
end
```

Example 4 (lua):
```lua
-- hooks/env_keys.lua
function PLUGIN:EnvKeys(ctx)
    local mainPath = ctx.path
    local runtimeVersion = ctx.runtimeVersion
    local sdkInfo = ctx.sdkInfo['nodejs']
    local path = sdkInfo.path
    local version = sdkInfo.version
    local name = sdkInfo.name

    return {
        {
            key = "NODE_HOME",
            value = mainPath
        },
        {
            key = "PATH",
            value = mainPath .. "/bin"
        },
        -- Multiple PATH entries are automatically merged
        {
            key = "PATH",
            value = mainPath .. "/lib/node_modules/.bin"
        }
    }
end
```

---

## Getting Started | mise-en-place

**URL:** https://mise.jdx.dev/getting-started

**Contents:**
- Getting Started ​
- 1. Install mise CLI ​
- 2. mise exec and run ​
- 3. Activate mise optional ​
  - Shell Feature Compatibility ​
- 4. Use tools from backends (npm, pipx, core, aqua, github) ​
- Trusting config files ​
- 5. Setting environment variables ​
- 6. Run a task ​
- 7. Next steps ​

Get up and running with mise in minutes.

See installing mise for other ways to install mise (macport, apt, yum, nix, etc.).

By default, mise installs to ~/.local/bin, but it can go anywhere.

Verify the installation:

mise respects MISE_DATA_DIR and XDG_DATA_HOME if you'd like to change these locations.

Once installed, you can start using mise right away to install and run tools, launch tasks, and manage environment variables.

The quickest way to run a tool at a specific version is mise x|exec. For example, to launch a Python 3 REPL:

If mise isn't on PATH yet, use ~/.local/bin/mise instead.

To install a tool permanently, use mise u|use:

mise r|run lets you run tasks or scripts with the full mise context (tools + env vars) loaded.

You can set a shell alias in your shell's rc file like alias x="mise x --" to save some keystrokes.

mise exec works great for one-off commands, but for interactive shells you'll probably want to activate mise so tools and environment variables are loaded automatically.

There are two approaches:

You can also skip both and call mise exec or mise run directly. See this guide for more information.

Here is how to activate mise for your shell:

Restart your shell session after modifying your rc file. Run mise dr|doctor to verify everything is set up correctly.

With mise activated, tools are available directly on PATH:

When you ran mise use --global node@26, mise updated your global config:

Not all shells support every mise feature:

Backends are the package ecosystems that mise pulls tools from. With mise use, you can install from any of them.

Install claude-code from npm:

Install black from PyPI via pipx:

Install ripgrep directly from GitHub releases:

Each mise use command above updates your config file. For example, after running all three globally, your ~/.config/mise/config.toml would contain:

You can also edit mise.toml directly instead of using mise use — the effect is the same. Run mise install after editing to install the tools.

See Backends for more ecosystems and details.

When you or a teammate adds a mise.toml to a project, mise will prompt you to trust it before it runs any env directives or hooks:

This is a security measure — config files can execute arbitrary code via [env] directives, hooks, and tasks. To trust a file, run:

This only needs to be done once per file. See mise trust for more details.

To disable trust prompts entirely, trust the root path:

Or set the environment variable MISE_TRUSTED_CONFIG_PATHS=/.

mise use automatically trusts the file it creates, so you'll only see this prompt when pulling a config someone else wrote or when editing mise.toml by hand.

Define environment variables in mise.toml — they'll be loaded whenever mise is activated or when using mise exec:

Define tasks in mise.toml and run them with mise run:

mise automatically installs all tools from mise.toml before running a task.

See tasks for more on defining and running tasks.

Follow the walkthrough for more examples on how to use mise.

See autocompletion to learn how to set up autocompletion for your shell.

Many tools in mise require the GitHub API. Unauthenticated requests are often rate limited — if you see 4xx errors, see GitHub Tokens for how to configure authentication.

**Examples:**

Example 1 (unknown):
```unknown
curl https://mise.run | sh
```

Example 2 (markdown):
```markdown
~/.local/bin/mise --version
# mise 2024.x.x
```

Example 3 (lua):
```lua
mise exec python@3 -- python
# this will download and install Python if it is not already installed
# Python 3.15.0
# >>> ...
```

Example 4 (elixir):
```elixir
mise exec node@26 -- node -v
# v26.x.x
```

---

## Demo | mise-en-place

**URL:** https://mise.jdx.dev/demo

**Contents:**
- Demo ​
- Transcript ​

The following demo shows:

mise exec <tool> -- <command> allows you to run any tools with mise

node is only available in the mise environment, not globally

Here is another example where we run terraform with mise exec

mise exec is great for running one-off commands, however it can be convenient to activate mise. When activated, mise will automatically update your PATH to include the tools you have installed, making them available directly.

We will start by installing node@lts and make it the global default

Note that we get back the path to the real node here, not a shim.

We can also install other tools with mise. For example, we will install terraform, jq, and go

Let's enter a project directory where we will set up node@26

As expected, node -v is now v26.x

We will leave this directory. The node version will revert to the global LTS version

**Examples:**

Example 1 (elixir):
```elixir
mise exec node@26 -- node -v
# mise node@26.x.x ✓ installed
# v26.x.x
```

Example 2 (markdown):
```markdown
node -v
# bash: node: command not found
```

Example 3 (elixir):
```elixir
mise exec terraform -- terraform -v
# mise terraform@1.11.3 ✓ installed
# Terraform v1.11.3
```

Example 4 (elixir):
```elixir
mise use --global node@lts
# v22.14.0
```

---
