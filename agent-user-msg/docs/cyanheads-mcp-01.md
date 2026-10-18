
```text

cyanheads use typescript with bun. I really like using bun when using typescript nowadays. I already have a prior bun typescript project with a mise.toml, although that was a monorepo where python was the main ecosystem
```



Bun fits this server well. Its own tooling assumes it (`bun run devcheck`, `bun run start:stdio`), and it's what the README's quickest install path uses.

One gotcha from their AGENTS.md: tests run under Vitest, so use `bun run test`, not `bun test`. Bun's built-in runner will pick up the files and fail in confusing ways.

There are two ways to use it.

**Consume it (no clone).** If you just want it as a tool server for the agent, `bunx` with a pinned version is enough. A mise.toml in the agent project can pin the runtimes and inject the token:

```toml
[tools]
bun = "1.4"
node = "24"        # engines: Bun ≥1.4.0 / Node ≥24

[env]
_.file = ".env"    # COURTLISTENER_API_TOKEN lives here, gitignored
COURTLISTENER_RATE_LIMIT_PER_MINUTE = "5"
COURTLISTENER_RATE_LIMIT_PER_HOUR = "50"
```

The MCP client config then runs `bunx @cyanheads/courtlistener-mcp-server@0.8.0` over stdio. The server inherits the mise environment if the agent is launched under `mise exec` or a mise-activated shell.

**Clone it and work on it.** Drop the same mise.toml into the checkout and use `bun install` and `bun run rebuild`. Bun's lockfile is `bun.lock`, which their `audit:refresh` script rewrites, so commit it deliberately.

**For a Python-led setup like your earlier monorepo,** the pattern carries over cleanly. Python can stay the main ecosystem for the MiCOURT scraping side, which is where the stronger browser-automation and captcha tooling lives. The CourtListener server just runs as a stdio subprocess that the Python agent's MCP client launches. mise pins both uv/Python and bun in one file, so a single `mise install` bootstraps everything.