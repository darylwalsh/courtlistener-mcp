
To conditionally set shared variables in mise based on the current directory or git branch, use Tera templates inside your [env] block to execute shell commands or check context variables.
## 1. Conditional by Git Branch
You can use the exec template function to run a shell command that fetches the current git branch, then use a standard Tera if/elif/else condition.

```toml

[env]# 1. Fetch the git branch dynamically
_GIT_BRANCH = { run = "git branch --show-current" }
# 2. Use Tera logic to assign variables
DEPLOY_ENV = """
{% if config.env._GIT_BRANCH == 'main' %}
production
{% elif config.env._GIT_BRANCH == 'develop' %}
staging
{% else %}
development
{% endif %}
"""
```


## 2. Conditional by Current Directory
You can use the built-in mise.cwd variable or a shell command to check your location and conditionally toggle settings.
## Option A: Checking for a specific folder name

```toml

`[env]# Evaluates to 'true' if the current path contains '/frontend'`
`IS_FRONTEND = "{% if 'frontend' in mise.cwd %}true{% else %}false{% endif %}"`
# Sets a port depending on the directory path
APP_PORT = "{% if 'backend' in mise.cwd %}8080{% else %}3000{% endif %}"
```

## Option B: Checking for a specific sibling file or directory
Use exec to check if a specific layout file exists in your current working directory.
```toml

[env]# Runs a quick directory check
HAS_DOCKERFILE = { run = "[ -f Dockerfile ] && echo 'true' || echo 'false'" }
# Shares a building strategy across tasks based on that check
BUILD_METHOD = "{% if config.env.HAS_DOCKERFILE == 'true' %}docker{% else %}local{% endif %}"
```

## 3. Alternative: Path-Based mise.local.toml
If your directory structure is fixed (e.g., a monorepo), you do not need complex conditional logic. mise automatically searches upwards for configuration files.
You can place a localized mise.local.toml or secondary mise.toml inside specific subdirectories to override global variables seamlessly without writing code.
```markdown

project-root/
├── mise.toml          # Global shared settings & tasks
└── apps/
    └── backend/
        └── mise.toml  # Overrides DATABASE_URL for backend tasks only
```

Would you like help writing a specific shell command to handle a complex nested directory structure or fallback environments?

