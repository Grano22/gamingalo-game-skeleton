---
name: gamingalo-testing
description: Use when writing or fixing tests for game code that uses the Gamingalo SDK, with createMockSdk from @gamingalo/sdk/testing and Vitest.
---

# Testing with the mock SDK

```ts
import { createMockSdk } from '@gamingalo/sdk/testing';

const sdk = await createMockSdk({
  modules: ['localization', 'accessibility'],   // same as in src/sdk.ts
  localization: { languages: ['pl-PL'] },
  player: { displayName: 'Ada' },               // omit to test without a signed-in player
  features: ['saves'],                          // omit 'saves' to test a browser that blocks storage
  plugins: [somePlugin()],
});
```

Controls in `sdk.mock`:

| Control | Simulates |
|---|---|
| `setConnection('offline')` | Losing the connection |
| `suspend()`, `resume()` | The tab being hidden and shown |
| `setNetwork({ pingMs: 300 })` | A slow network |
| `canvasFilter()` | Reads the filters plugins set |
| `accessibility.announcements()`, `mirrorItems()`, `activate(id)`, `setPreferences({...})` | What a screen reader user hears and does |

## Rules

* Each `createMockSdk` is independent, so create one per test.
* Mock mode only runs in tests. It refuses to start in a normal browser, and production builds don't contain it.
* Test rules in `src/game/logic.ts` directly. They're pure, so tests need no SDK.
* Pass a `seed` to `createGame` when a test depends on randomness.
* Use `expect.poll` for anything the game saves or loads in the background.
