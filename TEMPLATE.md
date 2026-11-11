# Maintaining the game skeleton

This repository is the template that `gamingalo create` copies for a new game. This file and `.gamingalo/` are removed from the copy.

## Keep it in step with the SDK

The skeleton must show current SDK practice. With every SDK release that changes the public API, or adds a feature games should use:

1. Update the `@gamingalo/*` versions in `package.json`.
2. Update the sample game, if the feature belongs in a typical game.
3. Update the skills in `.agents/skills/`, then run `npm run ai:sync`.
4. Update `docs/memory/gamingalo-sdk.md` if the lookup facts changed.
5. Run `npm run check` with the new packages, using `node scripts/use-local-gamingalo.mjs ../gamingalo` before they're published.
6. Commit with a Conventional Commit message, and tag the release with the SDK version it targets.

## How `gamingalo create` uses it

`.gamingalo/template.json` lists the placeholder ID and title, the files they appear in, and what to remove. The skeleton itself stays runnable with the placeholders, so it can be tested as is.
