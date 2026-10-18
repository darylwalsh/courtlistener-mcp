The failing line is here:

```toml
GITHUB_TOKEN = "{{env.GITHUB_TOKEN_DW}}"
GITHUB_PAT = "{{env.GITHUB_PAT_DW}}"
```

Your config loads `.secrets.env.json`, then tries to derive `GITHUB_TOKEN` and `GITHUB_PAT` from `GITHUB_TOKEN_DW` / `GITHUB_PAT_DW` . The `pman:floorp` task itself is simple and unrelated to GitHub tokens:

```toml
[tasks.'pman:floorp']
description = 'Install floorp via pacman'
run = 'sudo pacman -S floorp'
```



So the problem is not Floorp. mise is rendering the global `[env]` section before it runs any task, and the template `{{env.GITHUB_TOKEN_DW}}` hard-fails because that variable is missing.

## Immediate fix

Change this:

```toml
GITHUB_TOKEN = "{{env.GITHUB_TOKEN_DW}}"
GITHUB_PAT = "{{env.GITHUB_PAT_DW}}"
```

to this:

```toml
GITHUB_TOKEN = "${GITHUB_TOKEN_DW:-}"
GITHUB_PAT = "${GITHUB_PAT_DW:-}"
```

mise supports shell-style variable expansion in env values, including `${VAR:-default}` and `${VAR:-}` to expand to an empty string when unset. It also says shell expansion runs after Tera rendering, which is exactly what you want here: avoid Tera failing before the task runs. ([mise-en-place][1])

So your section becomes:

```toml
[env]
SOPS_AGE_KEY_FILE = "[REDACTED]"
XDG_CONFIG_HOME = "{{env.HOME}}/.config"

_.file = { path = ".secrets.env.json", redact = true }

NODE_ENV = "development"
HK_MISE = "1"

# Do not use Tera here; these may be absent during bootstrap.
GITHUB_TOKEN = "${GITHUB_TOKEN_DW:-}"
GITHUB_PAT = "${GITHUB_PAT_DW:-}"
```

That should allow:

```bash
mise run pman:floorp
```

to proceed even if `GITHUB_TOKEN_DW` is missing.

## Better long-term fix

For a workstation provisioning file, I would **not make GitHub identity global** unless every task actually needs it. Pacman tasks do not need GitHub tokens, so a missing GitHub token should not block `sudo pacman -S floorp`.

A cleaner pattern is:

```toml
[env]
SOPS_AGE_KEY_FILE = "[REDACTED]"
XDG_CONFIG_HOME = "{{env.HOME}}/.config"
_.file = { path = ".secrets.env.json", redact = true }

NODE_ENV = "development"
HK_MISE = "1"

# Do not set global GITHUB_TOKEN here.
```

Then only add GitHub env to tasks that need it:

```toml
[tasks."github:whoami"]
description = "Check active GitHub identity"
env = {
  GITHUB_TOKEN = "${GITHUB_TOKEN_DW:-}",
  GITHUB_PAT = "${GITHUB_PAT_DW:-}",
}
run = '''
gh auth status
gh api user --jq '.login'
'''
```

Or create a task family:

```toml
[tasks."gh:dw"]
description = "Run a command with DW GitHub token"
usage = 'arg "<cmd>"'
env = {
  GITHUB_TOKEN = "${GITHUB_TOKEN_DW:-}",
  GITHUB_PAT = "${GITHUB_PAT_DW:-}",
}
run = '{{usage.cmd}}'
```

## Confirm whether the secret actually exists

Since your comments say those tokens live in `.secrets.env.json`, check whether the decrypted file really has the top-level keys:

```bash
sops decrypt .secrets.env.json | jq 'keys'
```

Then specifically:

```bash
sops decrypt .secrets.env.json | jq -r '
  has("GITHUB_TOKEN_DW"),
  has("GITHUB_PAT_DW")
'
```

Expected:

```text
true
true
```

If you get `false`, either the keys are named differently, nested, or absent.

For example, mise expects this shape if you want top-level env vars:

```json
{
  "GITHUB_TOKEN_DW": "ghp_...",
  "GITHUB_PAT_DW": "ghp_...",
  "OPENAI_API_KEY": "sk-..."
}
```

Not this:

```json
{
  "github": {
    "GITHUB_TOKEN_DW": "ghp_..."
  }
}
```

mise’s `env._.file` supports JSON/YAML/TOML/dotenv files, and relative paths resolve relative to the config file/project root. ([mise-en-place][1])

## Another safe option: make the source token required

For tasks that truly need the DW GitHub token, declare the **source** variable as required, not the alias:

```toml
[tasks."github:doctor"]
description = "Verify GitHub token is available"
env = {
  GITHUB_TOKEN_DW = { required = "Set GITHUB_TOKEN_DW in .secrets.env.json or mise.local.toml" },
  GITHUB_TOKEN = "${GITHUB_TOKEN_DW}",
}
run = "gh api user --jq '.login'"
```

mise supports required env vars and can show help text when they are missing. ([mise-en-place][1])

## My recommendation for your file

Use this for global env:

```toml
[env]
SOPS_AGE_KEY_FILE = "[REDACTED]"
XDG_CONFIG_HOME = "{{env.HOME}}/.config"
_.file = { path = ".secrets.env.json", redact = true }

NODE_ENV = "development"
HK_MISE = "1"

# Safe optional aliases. These won't break pacman/bootstrap tasks.
GITHUB_TOKEN = "${GITHUB_TOKEN_DW:-}"
GITHUB_PAT = "${GITHUB_PAT_DW:-}"
```

Then add a diagnostic task:

```toml
[tasks."secrets:doctor"]
description = "Check expected secret variables are loaded without printing values"
run = '''
for name in GITHUB_TOKEN_DW GITHUB_PAT_DW OPENAI_API_KEY HF_TOKEN; do
  if [ -n "${!name:-}" ]; then
    echo "ok: $name is set"
  else
    echo "missing: $name"
  fi
done
'''
```

Then retry:

```bash
mise run secrets:doctor
mise run pman:floorp
```

The core rule: **avoid `{{env.SOME_SECRET}}` for optional secrets in global `[env]`**. Use `${SOME_SECRET:-}` or move the secret mapping into only the tasks that need it.

[1]: https://mise.jdx.dev/environments/ "Environments | mise-en-place"
