---
name: gamingalo-sdk
description: Use when writing or changing code that uses @gamingalo/sdk in a Gamingalo game, including starting the SDK, events, preferences, settings, localization, accessibility, the player profile, files, network and environment. Covers the SDK's rules, such as one reference and frozen objects.
---

# Using the Gamingalo SDK

Check the exact API in `node_modules/@gamingalo/sdk/dist/index.d.ts` first. It matches the installed version, and this skill doesn't replace it.

## Starting

The SDK starts once, in `src/sdk.ts`:

```ts
const sdk = await Gamingalo.init({
  gameId: config.id,                         // from gamingalo.json
  realm: { canvas },                         // binds filters and accessibility to this canvas
  modules: ['localization', 'accessibility'], // built-in modules to load; others aren't downloaded
  plugins,                                   // from 'virtual:gamingalo-plugins'
  platform: { origin },                      // only when running on the platform, for sdk.player
});
```

* `init` gives out **one reference per page**. A second `init` while it's running rejects with `SDK_ALREADY_INITIALIZED`. Pass the reference to the code that needs it.
* There is no `Gamingalo.instance()`, and no global. That's on purpose, so other scripts can't take over the SDK.
* Everything the SDK returns is frozen, with no prototype. Assigning to it throws in strict mode.
* Failures are `GamingaloError`s. Check them with `isGamingaloError(error)` and `error.code`, never with message text.

## What's available

| API | Use it for |
|---|---|
| `sdk.on(event, handler)` | `suspend`, `resume`, `connection`, `devices`, `graphics`, `accessibility`, `preferences`, `locale`. Returns an unsubscribe function. |
| `sdk.features.has(name)` | Checks before using `saves`, `files`, `player`, `localization` or `accessibility`. Unavailable features throw `FEATURE_UNAVAILABLE`. |
| `sdk.preferences` | Player-facing settings, with `define()` for types, defaults and limits. |
| `sdk.settings` | Developer-level graphics presets. Apply the values to your renderer yourself. |
| `sdk.saves` | Save slots. See the `gamingalo-saves` skill. |
| `sdk.session`, `sdk.cache`, `sdk.files` | Session memory, a file cache, and large files in OPFS. Check `await sdk.files.available()` first, because private browsing can block it. |
| `sdk.localization` | Needs `modules: ['localization']`. `addMessages`, `t(key, params)`, plurals with `count`, `detect()`. |
| `sdk.accessibility` | Needs `modules: ['accessibility']`. `mirror()` exposes canvas controls to keyboards and screen readers, and `announce()` speaks updates. |
| `sdk.player` | Needs `platform`. `profile()` gives a per-game player ID, display name, and whether the player is a minor or a guest. |
| `sdk.environment.read()` | Device capabilities. Missing values are `'unknown'`. Never guess them. |
| `sdk.network` | `measure()` sends requests only when called. It never exposes IP addresses. |
| `sdk.use(plugin)` | A plugin's API. See the `gamingalo-plugins` skill. |

## Rules

* Pause the game on `suspend`, and continue on `resume`.
* A player under 16 (`profile().minor`) gets no chat, no public sharing and no personalized ads.
* Never put translated text into `innerHTML`. Messages are plain text.
* Don't block assistive technology. Mirror every canvas control with `accessibility.mirror`.
