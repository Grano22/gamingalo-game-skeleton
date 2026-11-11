---
name: gamingalo-saves
description: Use when adding, reading or changing saved game data with sdk.saves, or when the shape of saved data changes and needs a version bump and migration.
---

# Saves and migrations

```ts
const canSave = sdk.features.has('saves');   // false when the browser blocks IndexedDB
if (canSave) {
  sdk.saves.configure({
    version: 2,
    migrations: { 1: (old: ProgressV1): ProgressV2 => ({ ...old, coins: 0 }) },
  });
  await sdk.saves.write('progress', data);   // Blobs and Files are fine
  const save = await sdk.saves.read<ProgressV2>('progress'); // older versions are migrated on read
}
```

## When the saved shape changes

1. Keep the old type, for example `ProgressV1`, and add the new one, `ProgressV2`.
2. Bump `version` in `configure`.
3. Add a migration keyed by the **old** version: `{ 1: (v1) => v2 }`. It must be pure: the same input always gives the same output.
4. Add a test that writes a version 1 save with the mock SDK, then reads it as version 2.
5. Never edit an existing migration once a version has shipped.

## Rules

* A save from a newer game version rejects with `SAVE_VERSION_TOO_NEW`. Tell the player to update, and never overwrite it.
* A failed migration rejects with `SAVE_MIGRATION_FAILED`, and leaves the stored save unchanged.
* `await sdk.saves.wasEvicted()` is `true` once if the browser deleted the saves. Tell the player.
* Call `await sdk.storage.requestPersistence()` after a meaningful action, not at startup, because Firefox shows a prompt.
* Saves are visible to and editable by the player. Anything that must be trusted, such as purchases, belongs on a server.
