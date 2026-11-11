# AI coding agents

This project is set up for Claude Code, OpenAI Codex, OpenCode and pi. They share the same instructions, skills and memory, so you can switch tools without losing context.

| Shared piece | Where | Read by |
|---|---|---|
| Instructions | `AGENTS.md` | Codex, OpenCode, pi, and Claude Code through `CLAUDE.md` |
| Skills | `.agents/skills/` | Codex and OpenCode directly, pi through `.pi/settings.json`, and Claude Code from its copy in `.claude/skills/` |
| Memory | `docs/memory/` | Every tool, through the basic-memory MCP server or as plain files |

After editing a skill, run `npm run ai:sync` to update Claude Code's copy. `npm run check` fails if the copies differ.

## Project memory with basic-memory

[basic-memory](https://pypi.org/project/basic-memory/) turns the notes in `docs/memory/` into a searchable knowledge graph. It runs with `uvx`, so install [uv](https://docs.astral.sh/uv/) first, then register this folder once:

```sh
npm run ai:memory
```

Every tool's configuration starts the same MCP server: `uvx --prerelease=allow basic-memory mcp`. The `--prerelease=allow` flag matters: without it, `uv` can install an older release.

## Claude Code

* `CLAUDE.md` imports `AGENTS.md`.
* `.claude/settings.json` allows the project's checks, asks before publishing or pushing, and blocks reading `.env` and signing keys.
* `.mcp.json` adds basic-memory.
* `.claude/agents/gamingalo-reviewer.md` reviews changes against the rules. Ask Claude to use it before committing.

## OpenAI Codex

* `.codex/config.toml` sets the approval and sandbox modes, and adds basic-memory. Codex loads project settings only after you trust the project.
* Skills come from `.agents/skills/`.

## OpenCode

* `opencode.json` adds the skills folder and basic-memory, and asks before publishing or pushing.

## pi

* `.pi/settings.json` adds the skills folder and the prompts in `.pi/prompts/`, such as `/feature`. `.pi/mcp.json` adds basic-memory. pi loads them after you trust the project.
* Providers and their credentials are personal, so they never go in this repository. Sign in with `/login`, or put credentials in `~/.pi/agent/auth.json`. Some providers need extra values, which go in the credential's `env` object. For example, Cloudflare Workers AI needs an account ID:

  ```json
  {
    "cloudflare-workers-ai": {
      "type": "api_key",
      "key": "your-api-token",
      "env": { "CLOUDFLARE_ACCOUNT_ID": "your-account-id" }
    }
  }
  ```

  See [pi's provider docs](https://pi.dev/docs/latest/providers#provider-specific-config) for each provider.

## Keeping secrets out

No tool configuration in this repository contains a credential. API tokens and signing keys stay in `~/.config/gamingalo/`, and provider keys stay in each tool's own user folder.
