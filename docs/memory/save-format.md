---
title: Save format
type: decision
permalink: save-format
tags: [saves, versions]
---

# Save format

## Observations
- [decision] The progress slot is version 1, with the shape { best: number } #saves
- [rule] A change to the shape bumps the version and adds a migration keyed by the old version #migrations
- [rule] Never edit a migration after its version has shipped #migrations

## Relations
- part_of [[Game architecture]]
- documented_in [[Gamingalo SDK]]
