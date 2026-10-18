

To include external task files and values in your main `mise.toml`, use the **`[task_config] includes`** configuration. [[1](https://mise.jdx.dev/tasks/task-configuration.html)]

How to Include Other Task Files

You can load additional tasks from local `.toml` files, local directories, or even remote Git repositories. [[1](https://mise.jdx.dev/tips-and-tricks.html)]

Add the following to your root `mise.toml`: [[1](https://mise.jdx.dev/tips-and-tricks.html), [2](https://mise.jdx.dev/tasks/task-configuration.html)]

toml

```
# mise.toml
[task_config]
includes = [
  "tasks.toml",
  "custom-tasks-folder",
  "git::https://github.com/myorg/shared-tasks.git//tasks?ref=v1.0.0"
]
```

Use code with caution.

Formatting the Included TOML Files

When writing tasks in an external file (like `tasks.toml`), **omit the `[tasks.]` prefix**. The file should directly mirror the shape of the standard tasks block. [[1](https://mise.jdx.dev/tips-and-tricks.html)]

**Correct Format (`tasks.toml`):**

toml

```
[build]
description = "Build the backend binary"
run = "go build -o bin/api"

[test]
description = "Run test suite"
run = "go test ./..."
```

Use code with caution.

_(Note: Formatting this file with `[tasks.build]` will throw an error.)_ [[1](https://github.com/jdx/mise/discussions/8730)]

Important Rules About `includes`

- **Default Directory Override**: Defining `includes` completely replaces `mise`'s default search paths (like `mise-tasks` or `.mise/tasks`). If you want to use custom files _and_ retain default script locations, you must list them explicitly:
    
    toml
    
    ```
    [task_config]
    includes = [
      "mise-tasks", 
      ".mise/tasks", 
      "tasks.toml"
    ]
    ```
    
    Use code with caution.
    
    [[1](https://mise.jdx.dev/tasks/task-configuration.html)]
- **Dynamic Paths**: The paths inside `includes` are evaluated using the Tera templating engine. You can use dynamic variables like `{{config_root}}` to handle nested projects safely. [[1](https://mise.jdx.dev/tasks/task-configuration.html)]

Would you like to know how to share **environment variables** across these included task files, or how to organize them for a **monorepo** setup?