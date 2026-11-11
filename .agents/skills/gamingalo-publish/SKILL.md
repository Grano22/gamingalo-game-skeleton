---
name: gamingalo-publish
description: Use when building, validating, publishing, previewing, promoting or rolling back the game with the gamingalo CLI, or when editing gamingalo.json or its budgets.
---

# Publishing

```sh
echo "$GAMINGALO_TOKEN" | npx gamingalo login --token-stdin   # once; create the token on the creator page
npx gamingalo game:create                                    # once; registers the ID in gamingalo.json
npx gamingalo game:keys:create                               # once; signing key in ~/.config/gamingalo/keys
npm run validate                                             # build, then check files and budgets
npm run publish:preview                                      # preview--<id> on the games domain
npx gamingalo game:versions
npx gamingalo game:promote 1.2.0                             # make a ready version live
npx gamingalo game:rollback 1.1.0
```

## Rules

* Bump `version` in `gamingalo.json` for every publish. Published versions never change.
* Only these file types are published: pages, scripts, styles, WebAssembly, images, audio, video, fonts, models and data. Hidden files are skipped, and symbolic links are refused.
* Budgets in `gamingalo.json` (`maxTotalBytes`, `maxFileBytes`, `maxFiles`) stop a publish that's too large. Shrink assets rather than raising budgets without a reason.
* In CI, set `GAMINGALO_TOKEN`, `GAMINGALO_API_URL`, `GAMINGALO_SIGNING_KEY` and `GAMINGALO_SIGNING_KEY_ID`. Never commit them.
* Games run on their own origin with a strict Content Security Policy: no inline scripts, no `eval`, no third-party scripts, and requests only to the game itself and the Gamingalo API. Bundle everything with Vite.
* `gamingalo.json` has a `schemaVersion`. The CLI migrates older files automatically. Don't change it by hand.
