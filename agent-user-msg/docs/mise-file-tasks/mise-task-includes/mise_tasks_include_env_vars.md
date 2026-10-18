To share environment variables and variables across included task files in `mise`, use the global `[env]` block and the built-in `config` variable context in your templates.

## Method 1: Global Environment Block (For Shell Variables)

Any variable declared in the root `[env]` block is automatically exposed to the shell environment of all tasks, including those loaded via `includes`.

Root `mise.toml`:

```toml
[env]
DATABASE_URL = "postgres://localhost:5432/db"
APP_ENV = "development"

[task_config]
includes = ["tasks.toml"]
```

Included `tasks.toml`:

```toml
[migrate]
description = "Run DB migrations"
run = "echo 'Connecting to:' $DATABASE_URL && atlas migrate apply"
```

## Method 2: Tera Templates (For Reusing Dynamic Values)

If you need to reuse raw configuration values inside TOML strings instead of injecting them into the shell environment, use `mise`'s Tera templating. You can reference root values using `{{config.env.VARIABLE}}`.

Root `mise.toml`:

```toml
[env]
DEPLOY_REGION = "us-east-1"

[task_config]
includes = ["deploy-tasks.toml"]
```

Included `deploy-tasks.toml`:

```toml
[push]
description = "Push image to AWS"
# Evaluates to "aws ecr get-login-password --region us-east-1"
run = "aws ecr get-login-password --region {{config.env.DEPLOY_REGION}}"
```

## Method 3: File-Specific `[env]` Blocks

If you want to isolate environment variables so they only apply to the tasks _inside_ a specific included file, define an `[env]` block directly inside that external file.

Included `tasks.toml`:

```toml
[env]
LOCAL_API_KEY = "secret_local_value"

[test-api]
run = "curl -H 'Authorization: $LOCAL_API_KEY' http://localhost/api"
```

_(Note: These variables will not leak back up to your root `mise.toml` tasks.)_

Would you like an example of how to conditionally set these shared variables based on the current directory or git branch?