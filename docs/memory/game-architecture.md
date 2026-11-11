---
title: Game architecture
type: concept
permalink: game-architecture
tags: [architecture]
---

# Game architecture

## Observations
- [rule] Game rules live in src/game/logic.ts and are pure functions, so they test without a browser #testing
- [rule] src/game/game.ts connects the rules to the SDK, and receives the SDK as a parameter #sdk
- [rule] The SDK starts once, in src/sdk.ts, and its reference is never stored globally #sdk
- [fact] Installed plugin packages reach init through virtual:gamingalo-plugins #plugins
- [fact] The board is a 3 by 3 grid, and a round lasts 30 seconds

## Relations
- uses [[Save format]]
- uses [[Gamingalo SDK]]
