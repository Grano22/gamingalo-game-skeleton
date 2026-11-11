---
title: Gamingalo SDK
type: concept
permalink: gamingalo-sdk
tags: [sdk]
---

# Gamingalo SDK

## Observations
- [source] The installed API is in node_modules/@gamingalo/sdk/dist/index.d.ts, which wins over memory #lookup
- [source] Changes between versions are in node_modules/@gamingalo/sdk/CHANGELOG.md #lookup
- [fact] Localization and accessibility load only when listed in init({ modules }) #modules
- [fact] Mock mode is only in @gamingalo/sdk/testing, and refuses to run outside tests #testing

## Relations
- used_by [[Game architecture]]
