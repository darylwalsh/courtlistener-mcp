# Mise - Bootstrap

**Pages:** 52

---

## Bootstrap Packages | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/packages/

**Contents:**
- Bootstrap Packages experimental ​
- Supported package managers ​
- Semantics ​
- Commands ​
- Choosing which managers run ​
- sudo ​
- CI usage ​

mise can ensure machine-global system packages are installed via the [bootstrap.packages] section of mise.toml:

Each entry is keyed "manager:package" — the manager prefix is required — and the value is a version: "latest" for whatever the manager installs, or a pin in the manager's native format where supported (see the per-manager pages).

mise can also place config files (dotfiles) — see Dotfiles, which uses mise dotfiles commands.

System packages are intentionally separate from [tools]: they are not version-pinned per-project, do not get shims, and are installed machine-globally by the platform's package manager — or, for brew and brew-cask, by mise's built-in Homebrew installers, which don't require Homebrew itself. Use them for shared libraries, build dependencies, and machine-global GUI apps (libssl-dev, postgresql, ffmpeg, firefox), not for project dev tools — those belong in [tools].

The [bootstrap] section can also declare repos ([bootstrap.repos]), applied by mise bootstrap repos apply, macOS defaults ([bootstrap.macos.defaults]), applied by mise bootstrap macos defaults apply, and macOS LaunchAgents ([bootstrap.macos.launchd.agents]), applied by mise bootstrap macos launchd-agents apply. Linux user services live in systemd ([bootstrap.linux.systemd.units]), applied by mise bootstrap linux systemd-units apply. Shell activation snippets live in Shell Activation ([bootstrap.mise_shell_activate]). Current-user login shells ([bootstrap.user].login_shell) are applied by mise bootstrap user apply or mise bootstrap.

For current-user login shell setup, use [bootstrap.user].login_shell:

See User Login Shell for details.

mise bootstrap packages use is mise use for system packages: it writes "manager:package" = "version" entries to mise.toml (the local file by default, the global one with -g) and installs whatever is missing. Entries for managers that aren't available on the current machine are written without installing — that's how a shared config picks up apt: lines authored on a Mac.

mise bootstrap packages import --manager brew is the inverse for Homebrew formulae: it reads the active Homebrew opt links and writes requested formulae to [bootstrap.packages] as "brew:<formula>" = "latest". By default it imports only formulae whose keg receipt says they were installed on request; pass --all to include dependency formulae too. Imported formulae are kept by future prune runs because they are now declared in config.

mise bootstrap packages prune --manager brew removes linked brew formulae that are no longer needed by the current config or by trusted, loadable tracked configs. This includes formulae installed by a real Homebrew. It is mise's declarative cleanup command, similar in spirit to Homebrew Bundle cleanup, not the old upstream brew prune command, which Homebrew removed.

mise bootstrap packages upgrade refreshes package manager metadata and upgrades the configured packages that are already installed to the newest available version — apk, apt, and dnf also honor a version pinned in config (pacman, brew, brew-cask, and mas can't install pins, so pinned entries are skipped with a warning). Packages that aren't installed yet are skipped — that's mise bootstrap packages apply's job. For brew this pours the formula's current bottle and replaces the old keg; for brew-cask this installs the current cask artifact; for mas this runs mas upgrade.

mise doctor also reports configured system packages and warns when any are missing.

By default mise acts on every configured manager that is available on the current machine. Since availability implies the OS (apt only exists on Debian-family systems, brew wherever a bottle exists), this usually does the right thing without configuration.

If more than one manager could apply — several package managers installed on one machine, or a shared config listing managers you don't want here — pick a subset with the system_packages.managers setting:

This composes with platform-specific config files (mise.macos.toml, mise.linux.toml) when you want different selections per OS.

The Linux package managers require root. When not running as root, mise elevates with sudo, which prompts for your password as usual. The same sudo path is used when [bootstrap.user].login_shell needs to add a shell to /etc/shells, and it only happens during an explicit mise bootstrap:

Set system_packages.sudo = false to forbid elevation entirely; mise will print the command for you to run yourself instead. The brew manager never needs sudo except once to create /opt/homebrew (see brew).

In containers you're typically already root, so no prompts occur:

mise bootstrap --yes combines both (and runs a task named bootstrap afterwards, if one is defined) — one command to set up a fresh machine or container.

mise bootstrap packages status --missing exits 1 when packages are missing, which makes a convenient CI check without installing anything.

**Examples:**

Example 1 (json):
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

Example 2 (json):
```json
[bootstrap.user]
login_shell = "/bin/zsh"
```

Example 3 (elixir):
```elixir
mise bootstrap packages status            # table of requested vs installed packages
mise bootstrap packages status --json     # machine-readable
mise bootstrap packages status --missing  # exit 1 if anything is out of sync (CI check)

mise bootstrap packages apply           # install whatever is missing (prompts first)
mise bootstrap packages apply apt:curl  # install specific packages (configured or not)
mise bootstrap packages apply --dry-run # print the commands without running them
mise bootstrap packages apply --yes     # skip the confirmation prompt
mise bootstrap packages apply --manager apt
mise bootstrap packages apply --update  # refresh package manager metadata first

mise bootstrap packages use apk:zlib-dev apt:curl brew:jq brew-cask:firefox mas:497799835
mise bootstrap packages use -g brew:ffmpeg                      # write globally
mise bootstrap packages use apt:curl@8.5.0-2   # pin a version (brew pins via the
                                   # formula name: brew:postgresql@17)

mise bootstrap packages import --manager brew   # add installed requested brew formulae
mise bootstrap packages import --manager brew --all
mise bootstrap packages import --manager brew --dry-run

mise bootstrap packages prune --manager brew    # remove unneeded linked brew formulae
mise bootstrap packages prune --manager brew --dry-run
mise bootstrap packages prune --manager brew --yes

mise bootstrap packages upgrade           # upgrade installed packages to current versions
mise bootstrap packages upgrade --manager brew
mise bootstrap packages upgrade --manager brew-cask
mise bootstrap packages upgrade --manager mas
```

Example 4 (json):
```json
[settings]
system_packages.managers = ["apt"]
```

---

## mise bootstrap macos | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos.html

**Contents:**
- mise bootstrap macos ​
- Subcommands ​

Manage macOS bootstrap config from [bootstrap.macos]

---

## mise bootstrap macos launchd-agents apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos/launchd-agents/apply.html

**Contents:**
- mise bootstrap macos launchd-agents apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---

## mise bootstrap packages upgrade | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/upgrade.html

**Contents:**
- mise bootstrap packages upgrade ​
- Arguments ​
  - [PACKAGE]… ​
- Flags ​
  - -m --manager <MANAGER> ​
  - -n --dry-run ​
  - -y --yes ​

Upgrade installed bootstrap packages from [bootstrap.packages]

Refreshes package manager metadata and upgrades the configured packages that are already installed: apk/apt/dnf/pacman upgrade to the newest available version (apk, apt, and dnf honor a version pinned in config), brew pours the formula's current bottle and replaces the old keg, brew-cask installs the current cask artifact, and mas upgrades App Store apps. Packages that are not installed yet are skipped — use mise bootstrap packages apply for those.

Packages can also be given explicitly in manager:package form.

Packages in manager:package form; defaults to everything configured in [bootstrap.packages]

Only upgrade packages for this manager, e.g. apk, apt, brew, brew-cask, or mas

Print the commands that would run without running them

Skip the confirmation prompt

**Examples:**

Example 1 (elixir):
```elixir
mise bootstrap packages upgrade
mise bootstrap packages upgrade brew:postgresql@17
mise bootstrap packages upgrade --manager brew-cask
mise bootstrap packages upgrade --manager mas
mise bootstrap packages upgrade --manager apt --yes
mise bootstrap packages upgrade --dry-run
```

---

## mise bootstrap launchd status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/launchd/status.html

**Contents:**
- mise bootstrap launchd status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured LaunchAgent is not in its desired state

---

## mise bootstrap linux systemd-units apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/linux/systemd-units/apply.html

**Contents:**
- mise bootstrap linux systemd-units apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---

## mise bootstrap linux systemd-units | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/linux/systemd-units.html

**Contents:**
- mise bootstrap linux systemd-units ​
- Subcommands ​

Manage systemd user services from [bootstrap.linux.systemd.units]

---

## mise bootstrap launchd apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/launchd/apply.html

**Contents:**
- mise bootstrap launchd apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---

## apk | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/packages/apk.html

**Contents:**
- apk experimental ​
- Behavior ​
- Version pins ​

System packages for Alpine Linux.

A pinned entry ("apk:zlib-dev" = "1.3.1-r2") shows as version mismatch in mise bootstrap packages status when a different version is installed, and mise bootstrap packages apply passes the pin to apk to correct it. "latest" entries are satisfied by any installed version — use mise bootstrap packages upgrade to move them to the newest available version.

**Examples:**

Example 1 (json):
```json
[bootstrap.packages]
"apk:build-base" = "latest"
"apk:zlib-dev" = "1.3.1-r2" # version pin
```

---

## Bootstrap | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap.html

**Contents:**
- Bootstrap experimental ​
- How it runs ​
- Example ​
- Inspecting State ​
- What Goes Where ​
- Hooks ​
- Common Workflows ​
  - New Machine ​
  - Add A Package ​
  - Capture An Edited Dotfile ​

packages, git repos, dotfiles, mise shell activation, macOS defaults, macOS LaunchAgents, Linux systemd user services, the user's login shell, tools, and any final project-specific task. You can also add hooks that run at named points in the bootstrap sequence.

Use bootstrap for things that are needed before a project or workstation is ready, but that do not belong in [tools]: native libraries, Homebrew formulae, dotfile repositories, shell rc files, editor config, macOS preferences, user services, and one-time machine setup.

mise bootstrap runs these steps in order:

Use mise bootstrap --skip <part> to skip specific parts. Supported parts are packages, repos, dotfiles, mise-shell-activate, macos-defaults, macos-launchd-agents, linux-systemd-units, user, tools, task, and final-hook. The old shorter names shell, defaults, launchd, and systemd are still accepted as aliases. The flag can be repeated or comma-separated, for example mise bootstrap --skip tools,task.

Use mise bootstrap --only <part> to run only specific parts. It supports the same part names and can be repeated or comma-separated, for example mise bootstrap --only dotfiles,tools. --only and --skip are mutually exclusive.

Hook phases can also run before and after the built-in steps: pre-packages, post-packages, pre-repos, post-repos, pre-dotfiles, post-dotfiles, pre-defaults, post-defaults, pre-user, post-user, pre-tools, and post-tools.

The declarative steps converge: if a package is already installed, a repo is already at the requested ref, a dotfile already matches, or a default is already set, mise skips it. The bootstrap task runs every time, so keep it idempotent.

When mise bootstrap applies or would apply something that needs user follow-up, it prints a final bootstrap: follow-up section after a successful run. Dry runs use bootstrap: follow-up if applied. If a later bootstrap phase fails after earlier phases already produced follow-up items, mise prints those items before returning the error. The section is omitted when there is nothing actionable to report.

By default, bootstrap refuses dotfile conflicts rather than replacing local files. Use mise bootstrap --force-dotfiles when you explicitly want the dotfiles phase to replace conflicting whole-file dotfile targets.

Use mise bootstrap status to inspect the declarative bootstrap state in one place:

mise bootstrap status --missing checks the whole declarative bootstrap surface in one command. The narrower mise bootstrap packages status --missing and mise bootstrap dotfiles status --missing commands are useful when you only want to check one part without installing anything.

Use declarative sections when mise can inspect and converge the state. Use [tasks.bootstrap] for imperative setup that does not fit those sections, such as running an auth flow, seeding local data, or other one-off project setup.

Hooks run only during explicit mise bootstrap invocations. A hook can be specified as a command string, an array of command strings, or a table with a run field. They use the same default inline shell setting as tasks, stop the bootstrap if they fail, and print the command instead of running it during mise bootstrap --dry-run. Hooks run in the current process environment; use mise exec -- ... inside a hook, or use [tasks.bootstrap], when the command needs tools from [tools] on PATH.

As shorthand, a hook phase can also be set directly:

Hooks merge across the config hierarchy from global to local, so shared config can define broad machine setup while a project adds its own phase commands.

This writes [bootstrap.packages] and installs what is missing.

mise dotfiles add stores the live file under dotfiles.root and writes an explicit [dotfiles] entry with mode.

For symlinked dotfiles, edit opens the managed source, so it works with the default symlink mode.

You can manage the dotfiles repository and the mise global config as dotfiles:

The repo/source must exist before the first apply. Use the real repo path for sources needed during the first run; ~/.dotfiles does not exist until mise creates that symlink. Replacing the active global config affects future mise invocations, so use this pattern carefully.

**Examples:**

Example 1 (elixir):
```elixir
[bootstrap.packages]
"apk:build-base" = "latest"
"apt:build-essential" = "latest"
"brew:postgresql@17" = "latest"

[bootstrap.repos]
"~/src/dotfiles" = { url = "git@github.com:jdx/dotfiles.git", ref = "main" }

[dotfiles]
"~/.gitconfig" = { mode = "symlink" }
"~/.config/nvim" = { mode = "symlink" }

[bootstrap.mise_shell_activate]
zprofile = "shims"
zshrc = "activate"
fish = "activate"

[bootstrap.macos.dock]
autohide = true
orientation = "left"
tilesize = 48

[bootstrap.macos.finder]
show_pathbar = true

[bootstrap.macos.keyboard]
key_repeat = 2
initial_key_repeat = 15

[bootstrap.macos.trackpad]
tap_to_click = true

[bootstrap.macos.defaults]
"com.apple.finder" = { AppleShowAllFiles = true }

[bootstrap.macos.launchd.agents.my-sync]
program = "~/.local/bin/my-sync"
args = ["--watch"]
run_at_load = true

[bootstrap.linux.systemd.units.my-sync]
description = "sync files"
exec_start = "~/.local/bin/my-sync --watch"
restart = "on-failure"

[bootstrap.user]
login_shell = "/bin/zsh"

[bootstrap.hooks.pre-packages]
run = "softwareupdate --install-rosetta --agree-to-license"

[bootstrap.hooks.post-defaults]
run = "killall Dock || true"

[tools]
node = "lts"
python = "3.12"

[tasks.bootstrap]
run = "gh auth status || gh auth login"
```

Example 2 (unknown):
```unknown
mise bootstrap --yes
```

Example 3 (unknown):
```unknown
mise bootstrap --dry-run
```

Example 4 (unknown):
```unknown
mise bootstrap status
mise bootstrap status --json
mise bootstrap status --missing
mise bootstrap packages status
mise bootstrap repos status
mise bootstrap dotfiles status
mise bootstrap dotfiles apply --dry-run
mise bootstrap dotfiles apply --dry-run --verbose
mise bootstrap mise-shell-activate status
mise bootstrap macos defaults status
mise bootstrap macos launchd-agents status
mise bootstrap linux systemd-units status
mise bootstrap user status
```

---

## launchd | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/launchd.html

**Contents:**
- launchd experimental ​
- Supported keys ​
- Semantics ​
- Commands ​

mise can declare macOS user LaunchAgents in [bootstrap.macos.launchd.agents] and apply them with mise bootstrap macos launchd-agents apply:

Each agent is written to ~/Library/LaunchAgents/dev.mise.<name>.plist and loaded with launchctl bootstrap gui/$UID ~/Library/LaunchAgents/dev.mise.<name>.plist. Agent names may contain letters, numbers, ., _, and -. mise owns only the plist files it creates with the dev.mise. label prefix.

program, working_directory, stdout_path, and stderr_path expand bare ~ and ~/ to the current user's home directory before writing the plist. args are passed through exactly as written.

status reports each agent as loaded, unloaded, differs, or missing. apply rewrites changed plists, unloads the old job if present, loads the new job, enables it, and runs kickstart only when kickstart = true.

**Examples:**

Example 1 (json):
```json
[bootstrap.macos.launchd.agents.my-sync]
program = "~/.local/bin/my-sync"
args = ["--watch"]
run_at_load = true
start_interval = 300
environment = { PATH = "/opt/homebrew/bin:/usr/bin:/bin" }
working_directory = "~"
stdout_path = "~/Library/Logs/my-sync.log"
stderr_path = "~/Library/Logs/my-sync.err.log"
```

Example 2 (unknown):
```unknown
mise bootstrap macos launchd-agents status            # shows LaunchAgent state
mise bootstrap macos launchd-agents status --json     # machine-readable
mise bootstrap macos launchd-agents status --missing  # exit 1 if any agent is missing, changed, or unloaded

mise bootstrap macos launchd-agents apply           # write and load missing/changed agents
mise bootstrap macos launchd-agents apply --dry-run # print the commands without running them
mise bootstrap macos launchd-agents apply --yes     # skip the confirmation prompt
```

---

## mise bootstrap dotfiles status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/dotfiles/status.html

**Contents:**
- mise bootstrap dotfiles status ​
- Arguments ​
  - [TARGET]… ​
- Flags ​
  - -J --json ​
  - --missing ​

Show the status of dotfiles from [dotfiles]

Only show these targets

Output in JSON format

Exit with code 1 if any configured dotfiles are not in their desired state (missing, source missing, differs)

**Examples:**

Example 1 (unknown):
```unknown
mise bootstrap dotfiles status
mise bootstrap dotfiles status ~/.zshrc
mise bootstrap dotfiles status --json
mise bootstrap dotfiles status --missing # exit 1 if anything is out of sync
```

---

## mise bootstrap user | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/user.html

**Contents:**
- mise bootstrap user ​
- Subcommands ​

Manage current-user bootstrap settings from [bootstrap.user]

---

## mise bootstrap packages status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/status.html

**Contents:**
- mise bootstrap packages status ​
- Flags ​
  - -J --json ​
  - --missing ​

Show the status of system packages from [bootstrap.packages]

Output in JSON format

Exit with code 1 if any configured packages are not in their desired state

**Examples:**

Example 1 (unknown):
```unknown
mise bootstrap packages status
mise bootstrap packages status --json
mise bootstrap packages status --missing # exit 1 if anything is out of sync
```

---

## mise bootstrap packages brew untap | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/brew/untap.html

**Contents:**
- mise bootstrap packages brew untap ​
- Arguments ​
  - <TAPS>… ​
- Flags ​
  - -l --local ​
  - -n --dry-run ​
  - -p --path <PATH> ​

Remove Homebrew tap URLs from [bootstrap.brew.taps]

Tap name(s), e.g. owner/repo

Write to the local config instead of the global config

Print the config change without writing it

Write to this config file or directory

**Examples:**

Example 1 (unknown):
```unknown
mise bootstrap packages brew untap railwaycat/emacsmacport
```

---

## Shell Activation | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/shell.html

**Contents:**
- Shell Activation experimental ​
- Semantics ​
- Commands ​

mise can declaratively add shell activation snippets for bash, zsh, and fish with [bootstrap.mise_shell_activate]. Configure startup-file targets directly when you want separate shims and normal activation setup:

Use compact table form when you want a shape that can accept future options:

Shell keys are shortcuts. For example, zsh = true expands to zprofile = "shims" and zshrc = "activate".

Any target can use either "activate" or "shims". Boolean true enables the target with its default mode, and false disables it.

mise bootstrap mise-shell-activate apply writes marker-delimited blocks to the shell rc file:

The markers are the same edit markers used by Dotfiles:

[bootstrap.mise_shell_activate] follows the same manual, idempotent model as other bootstrap sections:

For fully managed rc files or custom activation blocks, use [dotfiles] directly instead.

JSON status entries include target, shell, path, mode, and state. state is "missing" | "applied" | "differs" | "source_missing". Entries with state = "differs" also include a reason field.

**Examples:**

Example 1 (json):
```json
[bootstrap.mise_shell_activate]
zprofile = "shims"
zshrc = "activate"
bash_profile = "shims"
bashrc = "activate"
fish = "activate"
```

Example 2 (json):
```json
[bootstrap.mise_shell_activate]
zprofile = {enabled = true, mode = "shims"}
zshrc = {enabled = true, mode = "activate"}
```

Example 3 (markdown):
```markdown
# >>> mise:activate >>> managed by mise - do not edit between markers
eval "$(mise activate zsh)"
# <<< mise:activate <<<
```

Example 4 (unknown):
```unknown
mise bootstrap mise-shell-activate status            # shows activation block state
mise bootstrap mise-shell-activate status --json     # machine-readable
mise bootstrap mise-shell-activate status --missing  # exit 1 if anything is out of sync

mise bootstrap mise-shell-activate apply           # writes missing/different blocks
mise bootstrap mise-shell-activate apply --dry-run # print the edits instead
mise bootstrap mise-shell-activate apply --yes     # skip the confirmation prompt
```

---

## mise bootstrap macos-defaults apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos-defaults/apply.html

**Contents:**
- mise bootstrap macos-defaults apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---

## mise bootstrap macos launchd-agents | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos/launchd-agents.html

**Contents:**
- mise bootstrap macos launchd-agents ​
- Subcommands ​

Manage macOS LaunchAgents from [bootstrap.macos.launchd.agents]

---

## macOS Defaults | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/macos-defaults.html

**Contents:**
- macOS Defaults experimental ​
- Friendly sections ​
- Raw defaults ​
- Semantics ​
- Commands ​
- App restarts ​
- Finding keys ​

mise can declare macOS user defaults (preferences) in the [bootstrap.macos.defaults] section of mise.toml and apply them with mise bootstrap macos defaults apply:

The curated sections compile to raw defaults entries. Use [bootstrap.macos.defaults] for preferences not covered by the friendly sections. Within the same config file, raw defaults override the raw (domain, key) generated by a friendly setting. Across config files, normal global to local precedence still applies, so a local friendly setting can override a global raw default for the same pair.

[bootstrap.macos.dock] supports:

orientation must be bottom, left, or right.

[bootstrap.macos.finder] supports:

preferred_view_style must be icon, list, column, or gallery.

[bootstrap.macos.keyboard] supports:

[bootstrap.macos.trackpad] supports:

Unknown friendly keys, invalid enum values, and unsupported value types warn and are ignored.

Each key under [bootstrap.macos.defaults] is a preferences domain. Quote domains containing dots. Values map to the matching defaults write type:

Other plist shapes (arrays, dicts, dates, data) are not supported; entries using them parse fine but are skipped with a warning, so configs written for newer mise versions still work.

[bootstrap.macos.defaults] follows the same rules as [bootstrap.packages]:

User defaults are per-user, so unlike system packages no sudo is ever involved. Host-scoped preferences (defaults -currentHost) and sudo defaults system domains are not supported.

mise bootstrap macos defaults status reports each entry as set (matches), differs (a value exists but doesn't match — the current value is shown), or unset. mise doctor summarizes the same drift.

Some applications only pick up changed defaults after a relaunch — mise prints a reminder after writing, and top-level mise bootstrap includes the same reminder in its final follow-up summary. The usual suspects:

mise deliberately does not kill applications itself.

To discover a setting's domain and key, change it in System Settings and diff the output of defaults read before and after, or read a domain directly:

**Examples:**

Example 1 (json):
```json
[bootstrap.macos.dock]
autohide = true
orientation = "left"
tilesize = 48
show_recents = false

[bootstrap.macos.finder]
show_all_files = true
show_pathbar = true
preferred_view_style = "list"

[bootstrap.macos.keyboard]
key_repeat = 2
initial_key_repeat = 15
press_and_hold = false

[bootstrap.macos.trackpad]
tap_to_click = true

[bootstrap.macos.defaults]
"com.apple.finder" = { AppleShowAllFiles = true }
```

Example 2 (unknown):
```unknown
mise bootstrap macos defaults status            # shows defaults drift
mise bootstrap macos defaults status --missing  # exit 1 if anything is unset or differs

mise bootstrap macos defaults apply           # writes unset/differing defaults
mise bootstrap macos defaults apply --dry-run # print the `defaults write` commands
mise bootstrap macos defaults apply --yes     # skip the confirmation prompt
```

Example 3 (unknown):
```unknown
killall Dock
killall Finder
killall SystemUIServer
```

Example 4 (unknown):
```unknown
defaults read com.apple.dock
defaults read-type com.apple.dock tilesize
```

---

## mise bootstrap systemd status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/systemd/status.html

**Contents:**
- mise bootstrap systemd status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured systemd user service is not in its desired state

---

## User Login Shell | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/user.html

**Contents:**
- User Login Shell experimental ​
- Semantics ​
- Commands ​

mise can declare the current user's login shell in [bootstrap.user] and apply it with mise bootstrap user apply or mise bootstrap:

When the configured shell is not listed in /etc/shells, mise appends it first. When the configured shell differs from the user's account entry, mise runs:

Top-level mise bootstrap also includes a final follow-up reminder to start a new login session when it changes or would change the login shell.

[bootstrap.user].login_shell follows the same manual, idempotent model as bootstrap packages:

/etc/shells is usually root-owned. If the file is not writable, mise uses the same non-interactive sudo behavior as system packages: it can prompt in an interactive terminal, uses passwordless sudo in non-interactive contexts, and honors system_packages.sudo = false.

When mise itself is started under sudo, login shell status and chsh target SUDO_USER rather than root. Plain root sessions, such as containers, still target root.

**Examples:**

Example 1 (json):
```json
[bootstrap.user]
login_shell = "/bin/zsh"
```

Example 2 (unknown):
```unknown
chsh -s /bin/zsh
```

Example 3 (unknown):
```unknown
mise bootstrap user status            # shows login shell state
mise bootstrap user status --missing  # exit 1 if the shell differs or is not listed

mise bootstrap user apply           # updates /etc/shells and runs chsh -s
mise bootstrap user apply --dry-run # print the commands instead
mise bootstrap user apply --yes     # skip the confirmation prompt
```

---

## brew | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/packages/brew.html

**Contents:**
- brew experimental ​
- Casks ​
- Supported platforms ​
- The prefix ​
- Coexistence with a real Homebrew ​
- Importing and pruning ​
- How pouring works ​
- Source formulae ​
- Upgrades ​
- Limitations ​

Homebrew formulae and casks — without requiring Homebrew to be installed.

mise installs homebrew/core formulae directly into the canonical Homebrew prefix — /opt/homebrew on arm64 macOS, /home/linuxbrew/.linuxbrew on Linux. It fetches metadata from the formulae.brew.sh API, resolves the runtime dependency closure, downloads prebuilt bottles from ghcr.io (verifying sha256 checksums), and performs the same relocation, code-signing, and linking work brew does when pouring a bottle. Formulae without a usable bottle are built from source, also without Homebrew (see Source formulae). mise never shells out to brew for homebrew/core formulae.

Third-party taps are supported directly when the tap publishes Homebrew API metadata (api/formula/<name>.json or api/cask/<token>.json). Use the same fully-qualified name you would pass to Homebrew:

For taps whose GitHub URL cannot be inferred, add a tap source. This mirrors [plugins]: the key is the tap name and the value is the GitHub git URL.

mise bootstrap packages brew tap and mise bootstrap packages brew untap manage [bootstrap.brew.taps] in mise.toml; they do not mutate a Homebrew installation. Non-GitHub taps are not currently supported because mise needs direct raw access to the generated API metadata.

Casks use the brew-cask: manager. mise fetches cask metadata directly from the Homebrew cask API (or from tap API metadata), downloads the artifact, verifies its sha256 when the cask provides one, extracts the archive, and installs app bundles into /Applications while recording the version under <prefix>/Caskroom.

brew-cask currently supports app-bundle casks (app artifacts), binary casks (binary artifacts), and simple macOS installer packages (pkg artifacts) from dmg and common archive formats. Binary artifacts are staged in the Caskroom and linked into the Homebrew prefix, usually under <prefix>/bin. Package installers run through mise's normal system-package sudo path, so non-interactive runs never hang waiting for a password. Pkg casks must include pkgutil receipt IDs in their uninstall or zap metadata so mise can verify installed state after the installer writes files outside the Caskroom. Casks that require custom installer choices, services, or other cask artifact types fail with a clear unsupported artifact error instead of delegating to Homebrew. Lifecycle metadata such as preflight and postflight is not executed, and generated shell completions are not installed.

This exists because shared-library packages — postgres, ffmpeg, imagemagick, php — fundamentally can't be served by mise's per-project backends like aqua: or github:: their bottles are built against fixed install paths and a shared dependency tree. Installing them at Homebrew's canonical prefix is what makes them work.

Intel macs are not supported — the brew manager reports itself unavailable there. On Linux, formulae without a bottle for your architecture (arm64 Linux bottles exist for most but not all of homebrew/core) are built from source instead.

If the prefix doesn't exist, mise creates it with the standard layout — the only time the brew manager uses sudo, mirroring what Homebrew's own installer does (mkdir + chown to your user). After that, installs are plain file operations as your user; nothing runs as root.

mise pours bottles into the Cellar exactly the way brew does and writes brew-compatible INSTALL_RECEIPT.json files into every keg. To a real Homebrew installation, mise-poured kegs look like its own: brew list, brew upgrade, and brew uninstall all work on them. Conversely, mise's status checks read the Cellar directly, so formulae installed by brew count as installed.

mise reads the Homebrew prefix directly, whether formulae were poured by mise or by a real Homebrew. It never overwrites files in the prefix that it didn't create — link conflicts fail with a list of the offending files rather than clobbering them.

mise bootstrap packages import --manager brew snapshots installed Homebrew formulae into [bootstrap.packages], similar in spirit to brew bundle dump. It reads the active opt links in the Homebrew prefix and writes entries like:

By default, import records only formulae whose active keg receipt says they were installed on request. Pass --all to include dependency formulae too. Tapped formulae are written with fully-qualified names, and mise adds inferred [bootstrap.brew.taps] entries when it can derive the conventional GitHub tap URL:

mise bootstrap packages prune --manager brew treats the current config and trusted, loadable tracked configs as the source of truth. It removes linked Homebrew formulae that are not in the resolved dependency closure of those configured brew: entries, including formulae installed by a real Homebrew.

Prune removes the active keg, the opt link, and prefix symlinks pointing into that keg. Use --dry-run to preview and --yes to skip the confirmation prompt.

This command is mise's declarative cleanup for bootstrap packages, similar to brew bundle cleanup. It is not upstream brew prune, which Homebrew removed in favor of cleanup commands.

For each formula in the dependency closure (dependencies first):

A few formulae have no bottle at all (source-only formulae), and some have bottles for other platforms but not yours. mise builds those from source — still without Homebrew:

The shim implements the commonly-used subset of the formula DSL (configure/cmake/meson-style builds, resources, patches, the standard path and environment helpers). Formulae that use parts of the DSL the shim doesn't cover — language-specific helpers like virtualenv_install_with_resources, VCS downloads, and similar — fail with a clear formula uses ... error rather than miscompiling silently.

Source builds need a working toolchain (Xcode Command Line Tools on macOS, gcc/make on Linux), exactly as they would under plain Homebrew.

mise bootstrap packages upgrade re-resolves the configured formulae against the formulae.brew.sh API and pours any whose current version differs from the linked keg — the new keg replaces the old one and the links are repointed, the same dance brew upgrade does. Since bottles only exist for a formula's current version, "upgrade" and "install the current bottle" are the same operation.

**Examples:**

Example 1 (elixir):
```elixir
[bootstrap.packages]
"brew:postgresql@17" = "latest"
"brew:ffmpeg" = "latest"
"brew:imagemagick" = "latest"
"brew-cask:firefox" = "latest"
```

Example 2 (json):
```json
[bootstrap.packages]
"brew:railwaycat/emacsmacport/emacs-mac" = "latest"
"brew-cask:owner/tap/app" = "latest"
```

Example 3 (json):
```json
[bootstrap.brew.taps]
"acme/tools" = "https://github.com/acme/homebrew-tools.git"

[bootstrap.packages]
"brew:acme/tools/widget" = "latest"
"brew-cask:acme/tools/widget-app" = "latest"
```

Example 4 (unknown):
```unknown
mise bootstrap packages brew tap railwaycat/emacsmacport
mise bootstrap packages brew tap acme/tools https://github.com/acme/homebrew-tools.git
mise bootstrap packages brew untap acme/tools
```

---

## Repos | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/repos.html

**Contents:**
- Repos experimental ​
- Semantics ​
- Commands ​
- States ​

mise can declare git repositories in [bootstrap.repos] and apply them with mise bootstrap repos apply:

Each key is the target path. The url is required. The optional ref can be a branch, tag, or full commit SHA.

Repos run after [bootstrap.packages] and before [dotfiles], so a bootstrap config can install git, clone a dotfiles repository, and then apply dotfiles from that checkout.

**Examples:**

Example 1 (elixir):
```elixir
[bootstrap.repos]
"~/src/dotfiles" = { url = "git@github.com:jdx/dotfiles.git", ref = "main" }
"~/src/mise" = { url = "https://github.com/jdx/mise.git" }
```

Example 2 (sql):
```sql
mise bootstrap repos status            # shows repo checkout state
mise bootstrap repos status --json     # machine-readable
mise bootstrap repos status --missing  # exit 1 if any repo is not current

mise bootstrap repos apply           # clone or update missing/changed repos
mise bootstrap repos apply --dry-run # print the commands without running them
mise bootstrap repos apply --yes     # skip the confirmation prompt
```

---

## apt | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/packages/apt.html

**Contents:**
- apt experimental ​
- Behavior ​
- Metadata refresh ​
- Version pins ​

System packages for Debian-family Linux (Debian, Ubuntu, Mint, ...).

If /var/lib/apt/lists contains no package lists (fresh containers), mise runs apt-get update automatically before installing. Otherwise it does not touch apt metadata — if an install fails with "Unable to locate package", refresh explicitly:

A pinned entry ("apt:curl" = "8.5.0-2ubuntu10") shows as version mismatch in mise bootstrap packages status when a different version is installed, and mise bootstrap packages apply passes the pin to apt to correct it. "latest" entries are satisfied by any installed version — use mise bootstrap packages upgrade to move them to the newest available version.

**Examples:**

Example 1 (json):
```json
[bootstrap.packages]
"apt:libssl-dev" = "latest"
"apt:curl" = "8.5.0-2ubuntu10" # version pin
"apt:gcc:arm64" = "latest"     # architecture qualifier
```

Example 2 (unknown):
```unknown
mise bootstrap packages apply --update
```

---

## mise bootstrap status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/status.html

**Contents:**
- mise bootstrap status ​
- Flags ​
  - -J --json ​
  - --missing ​

Show the aggregate bootstrap status

Output in JSON format

Exit with code 1 if any configured bootstrap state is not in its desired state

---

## mise bootstrap packages use | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/use.html

**Contents:**
- mise bootstrap packages use ​
- Arguments ​
  - <PACKAGE>… ​
- Flags ​
  - -e --env <ENV> ​
  - -g --global ​
  - -n --dry-run ​
  - -p --path <PATH> ​
  - -y --yes ​

Add bootstrap packages to [bootstrap.packages] and install them

Like mise use for tools: writes "manager:package" = "version" entries to mise.toml (the local config by default, the global one with -g) and then installs whatever is missing.

Versions are pinned with @: mise bootstrap packages use apt:curl@8.5.0-2. Without @ (or with @latest) no pin is written. brew formulae and casks version through their names instead (for example brew:postgresql@17, brew-cask:temurin@17), where @ is part of the Homebrew name rather than a mise version selector. mas uses numeric ADAM IDs and does not support pins.

Packages in manager:package[@version] form

Write to the config file for this environment (mise.<ENV>.toml)

Write to the global config (~/.config/mise/config.toml) instead of the local one

Print the commands that would run without writing config or installing

Write to this config file or directory

Skip the confirmation prompt

**Examples:**

Example 1 (elixir):
```elixir
mise bootstrap packages use apk:zlib-dev apt:curl brew:jq brew-cask:firefox mas:497799835
mise bootstrap packages use -g brew:postgresql@17
mise bootstrap packages use apt:curl@8.5.0-2
```

---

## mise bootstrap linux systemd-units status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/linux/systemd-units/status.html

**Contents:**
- mise bootstrap linux systemd-units status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured systemd user service is not in its desired state

---

## mise bootstrap packages apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/apply.html

**Contents:**
- mise bootstrap packages apply ​
- Arguments ​
  - [PACKAGE]… ​
- Flags ​
  - -m --manager <MANAGER> ​
  - -n --dry-run ​
  - -y --yes ​
  - --update ​

Apply system packages from [bootstrap.packages]

Checks which configured packages are missing and installs them with the system package manager. This may elevate with sudo when not running as root (see the system_packages.sudo setting).

Packages can also be given explicitly in manager:package form (e.g. apk:zlib-dev, apt:curl, brew:jq); they are installed whether or not they appear in the config. Explicit packages and --manager scope the run to packages only. install is accepted as an alias for this command.

Packages in manager:package form; defaults to everything configured in [bootstrap.packages]

Only install packages for this manager, e.g. apk, apt, brew, brew-cask, or mas

Print the commands that would run without running them

Skip the confirmation prompt

Refresh package manager metadata first (apk: --update-cache, apt: apt-get update)

**Examples:**

Example 1 (json):
```json
mise bootstrap packages apply
mise bootstrap packages apply apk:zlib-dev apt:curl brew:jq brew-cask:firefox mas:497799835
mise bootstrap packages apply --dry-run
mise bootstrap packages apply --manager apt --yes
```

---

## mise bootstrap packages | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages.html

**Contents:**
- mise bootstrap packages ​
- Subcommands ​

Manage bootstrap system packages from [bootstrap.packages]

---

## mise bootstrap packages brew | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/brew.html

**Contents:**
- mise bootstrap packages brew ​
- Subcommands ​

Manage Homebrew taps used by bootstrap packages

These commands edit [bootstrap.brew.taps] so tapped formulae and casks can be fetched directly by mise without a Homebrew installation.

---

## mise bootstrap macos-defaults status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos-defaults/status.html

**Contents:**
- mise bootstrap macos-defaults status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured defaults are not in their desired state

---

## mise bootstrap user apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/user/apply.html

**Contents:**
- mise bootstrap user apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---

## systemd | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/systemd.html

**Contents:**
- systemd experimental ​
- Supported keys ​
- Semantics ​
- Commands ​

mise can declare Linux systemd user services in [bootstrap.linux.systemd.units] and apply them with mise bootstrap linux systemd-units apply:

Each unit is written to ~/.config/systemd/user/dev.mise.<name>.service and managed with systemctl --user. Unit names may contain letters, numbers, ., _, -, and @. mise owns only the service files it creates with the dev.mise. prefix.

exec_start and working_directory expand bare ~ and ~/ to the current user's home directory before writing the service file. wanted_by defaults to ["default.target"]; set wanted_by = [] to write the unit and disable any previous enablement. start defaults to true; set start = false to write and enable without keeping the unit running.

status reports each unit as active, inactive, differs, or missing. apply rewrites changed service files, runs systemctl --user daemon-reload, enables units with wanted_by, disables units with wanted_by = [], and restarts them when start = true or stops them when start = false.

**Examples:**

Example 1 (json):
```json
[bootstrap.linux.systemd.units.my-sync]
description = "sync files"
exec_start = "~/.local/bin/my-sync --watch"
after = ["network-online.target"]
wants = ["network-online.target"]
environment = { PATH = "/usr/local/bin:/usr/bin:/bin" }
working_directory = "~"
restart = "on-failure"
restart_sec = "5s"
standard_output = "append:%h/.local/state/my-sync.log"
standard_error = "journal"
```

Example 2 (unknown):
```unknown
mise bootstrap linux systemd-units status            # shows systemd user service state
mise bootstrap linux systemd-units status --json     # machine-readable
mise bootstrap linux systemd-units status --missing  # exit 1 if any unit is missing, changed, or inactive

mise bootstrap linux systemd-units apply           # write and start missing/changed units
mise bootstrap linux systemd-units apply --dry-run # print the commands without running them
mise bootstrap linux systemd-units apply --yes     # skip the confirmation prompt
```

---

## mise bootstrap mise-shell-activate status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/mise-shell-activate/status.html

**Contents:**
- mise bootstrap mise-shell-activate status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured shell activation is not in its desired state

---

## mise bootstrap macos launchd-agents status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos/launchd-agents/status.html

**Contents:**
- mise bootstrap macos launchd-agents status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured LaunchAgent is not in its desired state

---

## mise generate bootstrap | mise-en-place

**URL:** https://mise.jdx.dev/cli/generate/bootstrap.html

**Contents:**
- mise generate bootstrap ​
- Flags ​
  - -l --localize ​
  - -V --version <VERSION> ​
  - -w --write <WRITE> ​
  - --localized-dir <LOCALIZED_DIR> ​

Generate a script to download+execute mise

This is designed to be used in a project where contributors may not have mise installed.

Sandboxes mise internal directories like MISE_DATA_DIR and MISE_CACHE_DIR into a .mise directory in the project

This is necessary if users may use a different version of mise outside the project.

Specify mise version to fetch

instead of outputting the script to stdout, write to a file and make it executable

Directory to put localized data into

**Examples:**

Example 1 (sass):
```sass
mise generate bootstrap >./bin/mise
chmod +x ./bin/mise
./bin/mise install – automatically downloads mise to .mise if not already installed
```

---

## mise bootstrap repos apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/repos/apply.html

**Contents:**
- mise bootstrap repos apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---

## mise bootstrap macos defaults | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos/defaults.html

**Contents:**
- mise bootstrap macos defaults ​
- Subcommands ​

Manage macOS defaults from [bootstrap.macos.defaults]

---

## mise bootstrap packages import | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/import.html

**Contents:**
- mise bootstrap packages import ​
- Flags ​
  - -e --env <ENV> ​
  - -g --global ​
  - -m --manager <MANAGER> ​
  - --all ​
  - -n --dry-run ​
  - -p --path <PATH> ​

Import installed system packages into [bootstrap.packages]

Currently supports Homebrew formulae only. By default, imports linked formulae whose active keg receipt says they were installed on request. Pass --all to import every linked formula, including dependencies.

Write to the config file for this environment (mise.<ENV>.toml)

Write to the global config (~/.config/mise/config.toml)

Only import packages for this manager. Currently only brew is supported

Import every linked formula, including dependencies

Print the config change without writing config

Write to this config file or directory

**Examples:**

Example 1 (unknown):
```unknown
mise bootstrap packages import --manager brew
mise bootstrap packages import --manager brew --all
mise bootstrap packages import --manager brew --global
mise bootstrap packages import --manager brew --dry-run
```

---

## mise bootstrap mise-shell-activate | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/mise-shell-activate.html

**Contents:**
- mise bootstrap mise-shell-activate ​
- Subcommands ​

Manage mise shell activation from [bootstrap.mise_shell_activate]

---

## mise bootstrap user status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/user/status.html

**Contents:**
- mise bootstrap user status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured user setting is not in its desired state

---

## mise bootstrap repos status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/repos/status.html

**Contents:**
- mise bootstrap repos status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured repo is not in its desired state

---

## mise bootstrap linux | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/linux.html

**Contents:**
- mise bootstrap linux ​
- Subcommands ​

Manage Linux bootstrap config from [bootstrap.linux]

---

## mise bootstrap packages prune | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/prune.html

**Contents:**
- mise bootstrap packages prune ​
- Flags ​
  - -m --manager <MANAGER> ​
  - -n --dry-run ​
  - -y --yes ​

Prune installed system packages no longer declared in [bootstrap.packages]

Currently supports Homebrew formulae only. Pruning removes linked formulae that are not needed by the current config or by trusted, loadable tracked configs.

Only prune packages for this manager. Currently only brew is supported

Print what would be removed without deleting anything

Skip the confirmation prompt

**Examples:**

Example 1 (unknown):
```unknown
mise bootstrap packages prune --manager brew
mise bootstrap packages prune --manager brew --dry-run
mise bootstrap packages prune --manager brew --yes
```

---

## pacman | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/packages/pacman.html

**Contents:**
- pacman experimental ​
- Behavior ​

System packages for Arch-family Linux (Arch, Manjaro, EndeavourOS, ...).

Arch repositories only carry the latest version of each package, so pacman entries cannot be installed at a pinned version — mise bootstrap packages apply skips pinned entries with a warning, though mise bootstrap packages status still reports a version mismatch for them. AUR packages are not supported (they require an AUR helper and building from source).

**Examples:**

Example 1 (json):
```json
[bootstrap.packages]
"pacman:openssl" = "latest"
"pacman:base-devel" = "latest"
```

---

## mise bootstrap packages brew tap | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/packages/brew/tap.html

**Contents:**
- mise bootstrap packages brew tap ​
- Arguments ​
  - <TAP> ​
  - [URL] ​
- Flags ​
  - -l --local ​
  - -n --dry-run ​
  - -p --path <PATH> ​

Add a Homebrew tap URL to [bootstrap.brew.taps]

Tap name, e.g. owner/repo

GitHub URL for the tap. Defaults to https://github.com/<owner/homebrew-<repo>.git>

Write to the local config instead of the global config

Print the config change without writing it

Write to this config file or directory

**Examples:**

Example 1 (unknown):
```unknown
mise bootstrap packages brew tap railwaycat/emacsmacport
mise bootstrap packages brew tap acme/tools https://github.com/acme/homebrew-tools.git
```

---

## mise bootstrap | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap.html

**Contents:**
- mise bootstrap ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​
  - --force-dotfiles ​
  - --only… <ONLY> ​
  - --skip… <SKIP> ​
  - --update ​
- Subcommands ​

[experimental] Set up a machine for the current config in one command

Runs the bootstrap steps for the current config in order:

The declarative steps converge — anything already in its desired state is skipped, so re-running is safe. The bootstrap task runs on every invocation; keep it idempotent. Use it for any project-specific setup that doesn't fit the declarative sections (seeding databases, auth flows, etc.) — it runs with the installed tools on PATH.

Use --skip <part> to skip named parts, or --only <part> to run just named parts. Both flags can be repeated or comma-separated, but they cannot be used together.

Print what would happen without installing anything

Skip confirmation prompts

Overwrite existing files that conflict with whole-file dotfile entries

Run only one or more bootstrap parts

Can be passed multiple times or as a comma-separated list. Cannot be used with --skip.

Skip one or more bootstrap parts

Can be passed multiple times or as a comma-separated list.

Refresh system package manager metadata first (apk: --update-cache, apt: apt-get update)

**Examples:**

Example 1 (unknown):
```unknown
mise bootstrap                    # packages + repos + dotfiles + tools + bootstrap task
mise bootstrap --force-dotfiles   # replace conflicting dotfile targets
mise bootstrap --skip tools,task  # skip tool installation and the bootstrap task
mise bootstrap --only tools       # run just tool installation
mise bootstrap status --missing
mise bootstrap packages apply --yes
mise bootstrap repos status
mise bootstrap repos apply --dry-run
mise bootstrap dotfiles status
mise bootstrap mise-shell-activate apply --dry-run
mise bootstrap macos defaults status
mise bootstrap macos launchd-agents apply --dry-run
mise bootstrap linux systemd-units apply --dry-run
mise bootstrap user apply --dry-run
```

---

## mas | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/packages/mas.html

**Contents:**
- mas experimental ​
- Commands ​
- Caveats ​
- Finding IDs ​

Mac App Store apps via the mas CLI.

mas apps are part of [bootstrap.packages], just like apt packages, Homebrew formulae, and casks. The package name is the App Store app ID: a numeric ADAM ID accepted by mas install and mas upgrade.

mise does not install mas implicitly. Install it yourself first, for example with the built-in brew manager:

or with a normal mise tool if you have one configured globally:

mise bootstrap packages apply runs mas install <id> for missing apps. mise bootstrap packages upgrade runs mas upgrade <id> for installed apps. Both commands require numeric ADAM IDs; bundle identifiers such as com.apple.dt.Xcode are not valid package names.

mas is macOS-only and must be on PATH. On other platforms, or when the mas command is missing, shared configs list the entries as skipped instead of failing. Explicit commands such as mise bootstrap packages apply --manager mas still fail when mas is unavailable, matching the other package managers.

Mac App Store operations may require an Apple Account signed in to the App Store, macOS authentication, prior purchase/claiming for paid apps, and valid Spotlight indexing. mise surfaces errors from mas rather than trying to purchase or claim apps itself.

Use mas search or copy an App Store URL and extract the numeric ID:

For example, Xcode's App Store URL contains id497799835, so the package entry is:

**Examples:**

Example 1 (json):
```json
[bootstrap.packages]
"brew:mas" = "latest"
"mas:497799835" = "latest"       # Xcode
```

Example 2 (json):
```json
[bootstrap.packages]
"brew:mas" = "latest"
"mas:497799835" = "latest"
```

Example 3 (unknown):
```unknown
mise use -g mas
```

Example 4 (elixir):
```elixir
mise bootstrap packages use mas:497799835
mise bootstrap packages status
mise bootstrap packages apply --manager mas
mise bootstrap packages upgrade --manager mas
```

---

## mise bootstrap mise-shell-activate apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/mise-shell-activate/apply.html

**Contents:**
- mise bootstrap mise-shell-activate apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the actions that would run without writing anything

Skip the confirmation prompt

---

## mise bootstrap macos defaults status | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos/defaults/status.html

**Contents:**
- mise bootstrap macos defaults status ​
- Flags ​
  - -J --json ​
  - --missing ​

Output in JSON format

Exit with code 1 if any configured defaults are not in their desired state

---

## mise bootstrap systemd apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/systemd/apply.html

**Contents:**
- mise bootstrap systemd apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---

## mise bootstrap macos defaults apply | mise-en-place

**URL:** https://mise.jdx.dev/cli/bootstrap/macos/defaults/apply.html

**Contents:**
- mise bootstrap macos defaults apply ​
- Flags ​
  - -n --dry-run ​
  - -y --yes ​

Print the commands that would run without running them

Skip the confirmation prompt

---
