<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# I am looking to drill-down into mise "file tasks" (and then bubble back up to mise.toml to run mise file tasks).  How are mise file tasks (bash shell .sh scripts, or bun node typescript .ts ) to be created?  How does mise run/consume mise file tasks? can mise file tasks be referenced in a mise.toml and then called via a "meta" task on top of or wrapping the mise file task? I am familiar with mise, mise.toml and bog standard mise tasks defined in a mise.toml via [tasks.mytask] description ="" run=" some command or code to execute" . I am looking to broaden and deepen my knowledge of mise file tasks and concomitantly mise tasks / mise settings / mise configurations surrounding mise file tasks, as well as how to setup includes in top level mise.toml files to call either mise file tasks or other mise.toml files with tasks that call the mise file tasks.  I think mise is limited to 1 level of nesting for task includes?

I now have all the information needed for a comprehensive answer. Let me compile everything.

## Mise File Tasks: Deep Dive

File tasks are standalone executable scripts that mise discovers automatically from well-known directories, treating them as first-class tasks indistinguishable from TOML-defined ones. Here is everything you need to know, from creation to composition.

***

## Default Discovery Directories

Mise scans these directories relative to your project root for executable file tasks:[^1]

- `mise-tasks/`
- `.mise-tasks/`
- `.mise/tasks/`
- `.config/mise/tasks/`
- `mise/tasks/`

**Critical:** the file must be executable (`chmod +x`) or mise will not detect it. When `task_config.includes` is set, it **replaces** these defaults — you must re-list them explicitly if you want to keep them.[^2][^1]

***

## Creating File Tasks

### Bash `.sh` scripts

The shebang determines the interpreter. Mise-specific metadata goes in `#MISE` comment headers at the top:[^1]

```bash
#!/usr/bin/env bash
#MISE description="Build the project"
#MISE alias="b"
#MISE sources=["src/**/*.ts", "package.json"]
#MISE outputs=["dist/**/*"]
#MISE env={NODE_ENV = "production"}
#MISE depends=["lint", "test"]
#MISE tools={node="22"}

set -euo pipefail
npm run build
```

> ⚠️ **Formatter warning**: Some formatters convert `#MISE` → `# MISE`. The intentional workaround is the alternative header format `# [MISE]` which mise also accepts.[^1]

### Bun / TypeScript `.ts` scripts

Bun can run TypeScript directly without a build step. Use `#!/usr/bin/env bun` as the shebang and `//MISE` / `//USAGE` comment prefixes (double-slash for JS/TS comments):[^3][^1]

```typescript
#!/usr/bin/env bun
//MISE description="Deploy with TypeScript"
//MISE depends=["build"]
//USAGE flag "-e --env <env>" help="Target environment" default="staging"
//USAGE arg "<version>" help="Version to deploy"

const env = process.env["usage_env"] ?? "staging";
const version = process.env["usage_version"]!;

console.log(`Deploying version ${version} to ${env}`);
// full TypeScript, Bun APIs, node_modules all available
```

The file can have any name (no `.ts` extension required by mise — mise keys on the shebang and executability) but naming it with `.ts` helps editors.[^1]

### Deno TypeScript (alternative)

```typescript
#!/usr/bin/env -S deno run --allow-env
//MISE description="Hello from Deno TypeScript"

console.log(`PATH: ${Deno.env.get("PATH")}`);
```


***

## How Mise Consumes File Tasks

When you run `mise run build`, mise:[^4]

1. Walks all configured task directories and discovers executable files
2. Parses `#MISE` / `//MISE` headers to extract metadata (description, depends, sources, outputs, env, etc.)
3. Merges the file task into its DAG alongside any TOML-defined tasks
4. Runs the file exactly as the shebang specifies, setting `CWD` to the directory of `mise.toml` (overridable with `#MISE dir="{{cwd}}"`)
```
Arguments parsed by `#USAGE` directives are passed to the script as environment variables named `usage_<argname>`. For example, `#USAGE arg "<target>"` becomes `$usage_target` in bash.[^1]
```


***

## Task Grouping via Subdirectories

File tasks in subdirectories get automatically namespaced with `:`:[^1]

```
.mise/tasks/
├── build            → task name: build
└── test/
    ├── _default     → task name: test
    ├── integration  → task name: test:integration
    └── unit         → task name: test:unit
```

Run them with `mise run test:integration`. This is a clean way to organize related tasks without any TOML configuration.

***

## Referencing File Tasks from `mise.toml` — the "Meta Task" Pattern

Yes, a TOML task can absolutely wrap or orchestrate file tasks by name. Since all tasks — file or TOML — live in the same flat namespace, you reference them identically:[^2]

### Pattern 1: `depends` (prerequisite chain)

```toml
# mise.toml
[tasks.ci]
description = "Full CI pipeline"
depends = ["lint", "test:unit", "test:integration", "build"]
run = "echo 'CI complete'"
```

Where `lint`, `test:unit`, `test:integration`, and `build` are all file tasks in `.mise/tasks/`. The meta-task `ci` runs them in dependency order (parallelizing where possible) then echoes its own `run`.

### Pattern 2: `run` with structured task references (sequenced + parallel)

```toml
[tasks.deploy]
description = "Build, test, then deploy"
run = [
  { task = "build", args = ["--release"] },
  { tasks = ["test:unit", "test:integration"] },   # these two run in parallel
  { task = "publish", env = { REGISTRY = "prod" } },
  "echo 'Deployment complete'"
]
```


### Pattern 3: `depends_post` (cleanup/notification after file task)

```toml
[tasks.build]
depends_post = ["notify:slack"]
# 'build' itself is a file task; this TOML block overlays metadata onto it
```


### Pattern 4: TOML block overlay on a same-named file task (v2026.4.16+)

As of April 2026, a `[tasks.my-script]` block in `mise.toml` **merges** its metadata onto a file task of the same name instead of being silently dropped. This lets you augment a file task with `depends`, `env`, `description`, etc. purely from TOML:[^5]

```toml
# .mise/tasks/deploy  ← is the actual script
# mise.toml ← adds metadata
[tasks.deploy]
description = "Deploy (override description from TOML)"
depends = ["build", "test:unit"]
env.REGISTRY = "us-east-1.ecr.amazonaws.com"
```


***

## `task_config.includes`: Structure and Rules

### Basic syntax

```toml
[task_config]
includes = [
  "tasks.toml",         # a standalone task TOML file
  "mytasks",            # a directory of file tasks
  "tasks/**/*.toml",    # glob pattern (supported since v2026.1.9)
]
```

Glob support in `includes` was added in **v2026.1.9**.[^6]

### Included `tasks.toml` format

Included TOML task files use a **flat format** — no `[tasks.X]` prefix, just task names directly:[^2]

```toml
# tasks.toml (included file — NOT a mise.toml)
task1 = "echo task1"
task2 = "echo task2"

[task3]
run = "echo task3"
depends = ["task1"]
```


### The nesting / include-depth limitation

**Your intuition is correct.** Included `tasks.toml` files are **not** full `mise.toml` files — they are just task lists. They do **not** support a `[task_config]` section of their own, so they cannot themselves specify further `includes`. The include chain is effectively **one level deep**:[^7][^2]

```
mise.toml
 └─ [task_config].includes → tasks.toml   ✅  resolved
                           → mytasks/     ✅  resolved (file tasks)
                                ↓
                           tasks.toml cannot itself have [task_config].includes ❌
```

The workaround is to list all your task files and directories directly in the top-level `mise.toml`'s `[task_config].includes`, using glob patterns where possible:[^2]

```toml
[task_config]
includes = [
  "mise-tasks",          # keep defaults
  ".mise/tasks",
  "shared/tasks",        # extra file-task dir
  "tasks/build.toml",    # specific task TOML
  "tasks/deploy.toml",
  "tasks/**/*.toml",     # glob catches everything else
]
```


### Override behavior

When multiple includes define a task with the same name, **the last entry wins**. Use this to override shared/remote tasks with local ones:[^2]

```toml
[task_config]
includes = [
  "git::https://github.com/myorg/shared-tasks.git//tasks?ref=v1.0.0",
  ".mise/tasks",   # local tasks override shared ones with same name
]
```


***

## `[task_config]` Scope

`[task_config]` in a `mise.toml` applies only to tasks at that config root. A child directory's `mise.toml` with its own `[task_config].includes` replaces both the defaults **and** any parent `includes` for that subdirectory's scope — it does not merge with the parent.[^2]

***

## Relevant `[settings]` for File Tasks

These can be set in `mise.toml` or `~/.config/mise/config.toml`:[^2]


| Setting | Purpose |
| :-- | :-- |
| `task.disable_paths` | Paths mise will never scan for tasks |
| `task.output` | Output style: `prefix`, `interleave`, `keep-order`, `quiet`, `silent` |
| `task.run_auto_install` | Auto-install `tools` declared in file-task headers (default `true`) |
| `task.skip_depends` | Run only the named task, skip its dependency chain |
| `task.timeout` | Global default timeout; per-task timeout cannot exceed it |
| `task.timings` | Show elapsed time per task after `mise run` |
| `task.monorepo_depth` | How deep to search subdirs for tasks in monorepo mode |
| `task.source_freshness_hash_contents` | Use blake3 content hashing instead of mtime for `sources` |


***

## Practical Full Example

Here is a project layout tying everything together:

```
myproject/
├── mise.toml
├── tasks.toml              ← included standalone task TOML
└── .mise/tasks/
    ├── lint                ← bash file task
    ├── build               ← bash file task
    └── deploy/
        ├── staging         ← bash file task → name: deploy:staging
        └── production      ← bun TS file task → name: deploy:production
```

```toml
# mise.toml
[task_config]
includes = [
  ".mise/tasks",     # file tasks (keeps this default explicitly)
  "tasks.toml",      # additional TOML tasks
]

[tasks.ci]
description = "Full CI: lint → build → test"
depends = ["lint", "build"]
run = "echo 'CI passed'"

[tasks.release]
description = "CI then deploy to production"
depends = ["ci"]
run = [
  { task = "deploy:production", env = { CONFIRM = "yes" } }
]
confirm = "Are you sure you want to deploy to production?"
```

```bash
# .mise/tasks/lint
#!/usr/bin/env bash
#MISE description="Run ESLint"
#MISE sources=["src/**/*.ts", ".eslintrc*"]
npx eslint src/
```

```typescript
// .mise/tasks/deploy/production
#!/usr/bin/env bun
//MISE description="Deploy to production via Bun TS"
//MISE depends=["build"]
//USAGE flag "--dry-run" help="Preview without deploying"

const dryRun = process.env["usage_dry_run"] === "true";
if (dryRun) { console.log("Dry run — no changes made"); process.exit(0); }
console.log("Deploying to production...");
```

Run the whole chain with `mise run release`, which resolves to: `lint` + `build` (parallel if no dependency between them) → `ci` → confirm prompt → `deploy:production`.

***

## Key Takeaways

- File tasks are **first-class** and fully interoperable with TOML tasks via `depends`, `run = [{ task = "..." }]`, and the TOML overlay feature[^5]
- Shebangs drive execution: `#!/usr/bin/env bash`, `#!/usr/bin/env bun`, `#!/usr/bin/env -S deno run --allow-env` etc.[^1]
- `#MISE` headers for bash, `//MISE` for JS/TS — beware formatters mangling them; use `# [MISE]` as an escape hatch[^1]
- `task_config.includes` is **one level only** — included `tasks.toml` files cannot themselves include further files; use glob patterns in the root `mise.toml` to compensate[^7][^2]
- Since v2026.1.9, glob patterns like `tasks/**/*.toml` work in `includes`[^6]
- Since v2026.4.16, a TOML task block overlaying a same-named file task merges rather than silently dropping[^5]