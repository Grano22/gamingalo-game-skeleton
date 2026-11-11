# My game

A web game built with the [Gamingalo](https://gamingalo.example) SDK.

## Start

```sh
npm install
npm run dev
```

Open the address Vite prints. Press Space to start, then click the lit square or press 1 to 9.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Runs the game with hot reload |
| `npm test` | Unit and SDK tests |
| `npm run build` | Builds to `dist/` |
| `npm run validate` | Builds, then checks files and budgets |
| `npm run publish:preview` | Publishes to the preview channel |
| `npm run publish:production` | Publishes to players |
| `npm run check` | Everything, before you commit |

## What's inside

* **`src/game/logic.ts`:** the rules, as pure functions with tests.
* **`src/game/game.ts`:** the SDK features a typical game needs: saves with a versioned format, player preferences, two languages, an accessible mirror of the controls, and the signed-in player's name.
* **`src/sdk.ts`:** starts the SDK once, with installed plugins.
* **`gamingalo.json`:** ID, version, budgets and plugin options.

## Plugins

Installing a Gamingalo plugin package adds it to the SDK. No setup code is needed:

```sh
npm install @gamingalo/plugin-screen-preferences
```

`@gamingalo/vite-plugin` finds it, checks it works with your SDK version, and passes it to `Gamingalo.init`. Plugin options go in `gamingalo.json` under `plugins`. See `.agents/skills/gamingalo-plugins/SKILL.md`.

## Publishing

1. Create an API token on the Gamingalo creator page, then sign in: `echo "$TOKEN" | npx gamingalo login --token-stdin`.
2. Register the game and create a signing key, once: `npx gamingalo game:create && npx gamingalo game:keys:create`.
3. Bump `version` in `gamingalo.json`, then run `npm run publish:preview` or `npm run publish:production`.

## Working with AI agents

The project is ready for Claude Code, OpenAI Codex, OpenCode and pi, with shared instructions in `AGENTS.md`, skills in `.agents/skills/`, and a basic-memory knowledge graph in `docs/memory/`. See [docs/ai.md](docs/ai.md).

## Before the Gamingalo packages are published

Install them from a local checkout of the gamingalo monorepo, after building it:

```sh
node scripts/use-local-gamingalo.mjs ../gamingalo
```
