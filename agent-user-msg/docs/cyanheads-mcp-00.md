```text
I added and AGENTS.md and a README.md for a git repo for a courtlistener-mcp-server to run locally that looks promising, AGENTS_cyanheads_courtlistener-mcp-server.md & README_cyanheads_courtlistener-mcp-server.md .. as it's in active development and appears to have some helpful features in the context of use in an agentic application.  Can you compare cyandheads/courtlister-mcp-server to the blakeox version I added the README-blakeox-courtlisterne-mcp.md earlier? Please advise if the cyanheads mcp version would be a good local mcp server to use in the legal research agent process
```

**Short answer:** Of the two, the cyanheads server is the better choice to run locally. But neither one can replace your MiCOURT searches. They are a complementary layer, not the core of the C54/D71B workflow.

## The coverage gap

CourtListener holds case law (opinions), federal dockets mirrored from PACER (RECAP), judges, oral arguments, and financial disclosures. For Michigan, that means Michigan Supreme Court and Court of Appeals opinions, plus federal dockets for Eastern District of Michigan district and bankruptcy courts. As far as I know, it does not index state trial-court case records. So results like `NORDSTROM V TUSCOLA` (54th Circuit) or the 71B Caro civil and traffic cases won't appear in it. The MiCOURT `/api/casesearch/v1/cases/search` path, including the captcha and Akamai cookie handling, is still the part your agent has to solve itself.

CourtListener is still useful for:
- **Federal exposure on the same names.** You can search RECAP dockets by party name, filtered to E.D. Mich. district or bankruptcy courts.
- **Appeals.** If a Tuscola or Caro case went up, you'd find the Court of Appeals or Supreme Court opinion here.
- **Citation checks** on anything the agent drafts.

## Head-to-head

| | **cyanheads** | **blakeox** |
|---|---|---|
| Tool count | 14, focused and read-only | 52, including alerts, bulk data, bankruptcy, visualization, and "smart"/analysis tools |
| Local install | Published on npm (`npx`/`bunx`), Docker image, or a clone | npm package not published; you build from a checkout with pnpm |
| Main design focus | Output an agent can work with | Hosted deployment: Cloudflare Workers, OAuth, Turnstile |
| Rate limiting | Built-in queue set to free-tier limits (5/min, 50/hr). Bursts wait instead of failing. A 429 pauses the queue and `Retry-After` is honored. | Caching is mentioned; no comparable pacing is documented |
| Large responses | Each response capped at 24 KB, with an outline first and cursor-based pages. Source text is never truncated. | Not documented |
| Errors | Typed `reason` plus a required recovery hint. Rate-limit errors include `retryAfter`. | Not documented |
| Data integrity | Explicit rule against inventing missing fields. Coverage caveats (`coverage_note`, `court_resolution`) appear inline. | Not documented |
| Chaining | Every result carries the IDs (`cluster_id`, `docket_id`, `person_id`) the next tool expects | Presumably similar; not spelled out |
| Maturity | v0.8.0, pre-1.0, actively released | Mature CI and release process, but a lot of that weight is hosting infrastructure |
| License | Apache-2.0 | MIT |

blakeox's strengths are breadth and its hosted-service setup. For a local stdio server feeding an agent, much of that is overhead you won't use, such as OAuth, three Workers, and the SPA portal. cyanheads is built around what matters inside an agent loop: predictable response sizes, recoverable errors, and pacing that won't burn your quota. That matters because the free tier is only 125 requests per day. Your roughly 14 names searched once or twice a week fit easily, but only with pacing.

## If you adopt cyanheads

- **Pin the version** (`@cyanheads/courtlistener-mcp-server@0.8.0`, not `@latest`). It's pre-1.0, so breaking changes can arrive in minor releases.
- **Set the rate-limit environment variables** to your actual token tier.
- **Make `search_dockets` (with `party_name` and a court filter) your main tool** for name monitoring, and treat `coverage_note` as real. RECAP's PACER coverage is partial, so "no match" is not proof that no federal case exists.
- **Know what's missing:** it has no alert or subscription tools. This chat already has a CourtListener connector with docket-alert and search-alert tools, which may handle the "notify me" side better than polling.

Caveat: this comparison is based on the two READMEs and the AGENTS.md, not on running either server.