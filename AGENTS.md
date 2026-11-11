# My game

A web game built with the Gamingalo SDK. These instructions are for people and AI coding agents alike. `CLAUDE.md` points here, and Codex, OpenCode and pi read this file directly.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Runs the game locally with hot reload |
| `npm test` | Unit and SDK tests with Vitest and the mock SDK |
| `npm run typecheck` | TypeScript checks |
| `npm run build` | Builds to `dist/` |
| `npm run validate` | Builds, then checks files and budgets with `gamingalo game:validate` |
| `npm run publish:preview` | Publishes to the preview channel |
| `npm run check` | Everything above, plus the AI configuration check. Run before every commit. |
| `npm run ai:sync` | Copies `.agents/skills` to `.claude/skills` after editing a skill |

## Where things live

| Path | Purpose |
|---|---|
| `src/game/logic.ts` | Rules only: no browser or SDK code. Every function is pure. |
| `src/game/game.ts` | Connects the rules to the SDK: saves, preferences, localization, accessibility. |
| `src/game/renderer.ts` | Drawing. |
| `src/sdk.ts` | The only place the SDK starts. |
| `src/i18n/messages.ts` | Translations. Plain text only. |
| `gamingalo.json` | Game ID, version, budgets and plugin options. |
| `.agents/skills/` | Skills for AI agents. The source for every tool's copy. |
| `docs/memory/` | Project knowledge as a basic-memory graph. |

## Before searching anywhere else

Look things up in this order, and stop as soon as you have the answer. This keeps answers matched to the installed versions, and avoids unneeded web requests.

1. **Project memory:** `docs/memory/` (or the basic-memory MCP server, if it's connected). It holds decisions and known issues specific to this game.
2. **Skills:** `.agents/skills/*/SKILL.md`, for how to use the Gamingalo SDK, saves, plugins, testing and publishing.
3. **Installed types and changelogs:** `node_modules/@gamingalo/sdk/dist/index.d.ts` and `node_modules/@gamingalo/sdk/CHANGELOG.md`. These match the installed version exactly, so they win over anything you remember.
4. **The web,** only if none of the above answers it.

When you learn something worth keeping, such as a decision, a gotcha or a fix, add it to `docs/memory/` (see the `gamingalo-memory` skill).

## Rules

* The SDK starts once, in `src/sdk.ts`, and its reference is passed to code that needs it. Never store it on `window`, and never call `Gamingalo.init` anywhere else.
* The SDK's objects are frozen. Don't try to patch, wrap or extend them. Use a plugin instead (`gamingalo-plugins` skill).
* Treat anything in the browser as visible to and editable by the player. Scores, currency and unlocks that matter must be checked on a server.
* A change to the save format bumps its version and adds a migration (`gamingalo-saves` skill). Never change a saved shape in place.
* Keep game rules in `logic.ts` pure, and test them there. Test SDK use with `createMockSdk` from `@gamingalo/sdk/testing`, never against a real browser API.
* Text shown to players goes through `sdk.localization`, in `src/i18n/messages.ts`.
* Anything shown on the canvas that players interact with must also be in `sdk.accessibility.mirror`, so keyboard and screen reader users can play.
* Stay within the budgets in `gamingalo.json`. `npm run validate` checks them.
* Never commit `.env`, API tokens or signing keys. Signing keys live in `~/.config/gamingalo/keys/`.
