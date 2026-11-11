---
name: gamingalo-plugins
description: Use when adding, configuring or writing a Gamingalo SDK plugin, or when a feature should extend the SDK instead of changing game code. Installing a plugin package is enough to add it to the SDK.
---

# Plugins

## Using a plugin

1. `npm install <plugin-package>`. It must go in `dependencies`, not `devDependencies`.
2. Optionally, add options in `gamingalo.json`:

   ```json
   { "plugins": { "@gamingalo/plugin-screen-preferences": { "limits": { "brightness": { "min": 0.8, "max": 1.2 } } } } }
   ```

   `false` instead of an object turns an installed plugin off.
3. That's all. `@gamingalo/vite-plugin` finds it, checks it supports the installed SDK, and adds it to `plugins` from `virtual:gamingalo-plugins`, which `src/sdk.ts` passes to `init`.
4. Get its API with `sdk.use(plugin)`. Find the plugin object in `plugins` by its `name`, or create it yourself in tests.

A build fails with a clear message if a plugin needs another SDK version, or if `gamingalo.json` configures a package that isn't installed.

## Writing a plugin package

`package.json`:

```json
{
  "name": "my-gamingalo-plugin",
  "keywords": ["gamingalo", "gamingalo-plugin"],
  "gamingalo": { "formatVersion": 1, "sdk": ">=0.14.0 <1.0.0" },
  "peerDependencies": { "@gamingalo/sdk": ">=0.14.0 <1.0.0" }
}
```

Main entry:

```ts
import type { GamingaloPlugin, PluginContext } from '@gamingalo/sdk';

export function gamingaloPlugin(options: { strength?: number } = {}): GamingaloPlugin<{ boost(): void }> {
  return Object.freeze({
    name: 'my-plugin',
    setup(context: PluginContext) {
      context.preferences.define({ strength: { type: 'number', default: options.strength ?? 1 } });
      return { boost: () => context.setCanvasFilter('saturate(1.5)') };
    },
  });
}
```

* `setup` receives only a limited context: the game ID, realm, environment, its own preferences, a canvas filter layer and `addCleanup`. It never receives the SDK's internals.
* Read options with own-property checks, and validate them. The game controls them.
* Test with `createMockSdk({ plugins: [gamingaloPlugin()] })` and `sdk.mock.canvasFilter()`.
