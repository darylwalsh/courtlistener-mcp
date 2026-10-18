
Environment variables
TIP

Normally environment variables in mise are used to set settings so most environment variables are in that doc. The following are environment variables that are not settings.

A setting in mise is generally something that can be configured either as an environment variable or set in a config file.

mise can also be configured via environment variables. The following options are available:

MISE_DATA_DIR
Default (Linux): ~/.local/share/mise or $XDG_DATA_HOME/mise Default (macOS): ~/.local/share/mise or $XDG_DATA_HOME/mise Default (Windows): %LOCALAPPDATA%\mise or $XDG_DATA_HOME/mise

This is the directory where mise stores plugins and tool installs. These are not supposed to be shared across machines.

MISE_CACHE_DIR
Default (Linux): ~/.cache/mise or $XDG_CACHE_HOME/mise Default (macOS): ~/Library/Caches/mise or $XDG_CACHE_HOME/mise Default (Windows): %TEMP%\mise or $XDG_CACHE_HOME/mise

This is the directory where mise stores internal cache. This is not supposed to be shared across machines. It may be deleted at any time mise is not running.

MISE_TMP_DIR
Default: std::env::temp_dir() implementation in rust

This is used for temporary storage such as when installing tools.

MISE_SYSTEM_CONFIG_DIR
Default: /etc/mise

This is the directory where mise stores system-wide configuration. MISE_SYSTEM_DIR is also supported as a legacy alias.

MISE_GLOBAL_CONFIG_FILE
Default: $MISE_CONFIG_DIR/config.toml (Usually ~/.config/mise/config.toml)

This is the path to the config file.

Use this when you want global writes, such as mise use or mise set run from $HOME, to target a different config file. MISE_DEFAULT_CONFIG_FILENAME customizes the default local config filename, not the global config path.

MISE_DEFAULT_CONFIG_FILENAME
Default: mise.toml

This customizes the default local config filename used when mise creates or looks for project config files.

MISE_GLOBAL_CONFIG_ROOT
Default: $HOME

This is the path which is used as {{config_root}} for the global config file.

MISE_ENV_FILE
Set to a filename to read env from a dotenv file. e.g.: MISE_ENV_FILE=.env. This searches for and loads all matching files in the current directory and parent directories. Uses dotenvy under the hood.

MISE_${TOOL}_VERSION
Set the version for a tool. For example, MISE_NODE_VERSION=20 will use node@20.x regardless of what is set in mise.toml/.tool-versions.

MISE_TRUSTED_CONFIG_PATHS
This is a list of paths that mise will automatically mark as trusted. They are separated according to platform conventions for the PATH environment variable: : on Unix and ; on Windows.

MISE_CEILING_PATHS
This is a list of paths where mise will stop searching for configuration files and file tasks. This is useful to stop mise searching for files in slow loading directories. They are separated according to platform conventions for the PATH environment variable. On most Unix platforms, the separator is : and on Windows it is ;.

MISE_LOG_LEVEL=trace|debug|info|warn|error
These change the verbosity of mise.

You can also use MISE_DEBUG=1, MISE_TRACE=1, and MISE_QUIET=1 as well as --log-level=trace|debug|info|warn|error.

MISE_LOG_FILE=~/mise.log
Output logs to a file.

MISE_LOG_FILE_LEVEL=trace|debug|info|warn|error
Same as MISE_LOG_LEVEL but for the log file output level. This is useful if you want to store the logs but not have them litter your display.

MISE_LOG_HTTP=1
Display HTTP requests/responses in the logs.

MISE_LOG_VERBOSE_DEPS=1
Debug and trace logs from noisy third-party crates (h2, hyper, reqwest, rustls, etc., which emit a line per HTTP/2 frame or socket read) are always dropped — they would otherwise overwhelm debug/trace output. Set this to 1 to let those logs through; it is the only way to see them, including under --log-level=trace/-vv.

MISE_QUIET=1
Equivalent to MISE_LOG_LEVEL=warn.

MISE_HTTP_TIMEOUT
Set the timeout for http requests in seconds. The default is 30.

MISE_RAW=1
Set to "1" to directly pipe plugin scripts to stdin/stdout/stderr. By default stdin is disabled because when installing a bunch of plugins in parallel you won't see the prompt. Use this if a plugin accepts input or otherwise does not seem to be installing correctly.

Sets MISE_JOBS=1 because only 1 plugin script can be executed at a time.

MISE_TERM_WIDTH
Override the terminal width mise uses to render tables and lists (e.g. mise ls). By default mise detects the width from the terminal. This is useful in CI or other non-interactive environments where detection returns a bogus value (for example CircleCI, where the width is reported as 0), producing oddly wrapped output.

If MISE_TERM_WIDTH is unset, mise falls back to the conventional COLUMNS environment variable, and finally to auto-detection. The override is honored exactly, so you can also force a narrower width:


MISE_TERM_WIDTH=120 mise ls
MISE_FISH_AUTO_ACTIVATE=1
Configures the vendor_conf.d script for fish shell to automatically activate. This file is automatically used in homebrew and potentially other installs to automatically activate mise without configuring.

Defaults to enabled, set to "0" to disable.