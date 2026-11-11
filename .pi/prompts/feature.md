---
description: Plan and build a game feature with the Gamingalo SDK
---

Build this feature: $ARGUMENTS

1. Follow the lookup order in AGENTS.md: project memory, then skills, then the installed SDK types, then the web.
2. Put rules in src/game/logic.ts as pure functions, and SDK use in src/game/game.ts.
3. Add tests: logic directly, and SDK use with createMockSdk.
4. Run `npm run check`, and fix anything it reports.
5. Record any decision or gotcha in docs/memory.
