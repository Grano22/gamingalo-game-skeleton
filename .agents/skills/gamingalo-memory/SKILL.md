---
name: gamingalo-memory
description: Use at the start of a task to recall project decisions and known issues, and at the end to record new ones, in the basic-memory knowledge graph in docs/memory.
---

# Project memory

`docs/memory/` is a [basic-memory](https://pypi.org/project/basic-memory/) project: Markdown notes linked into a knowledge graph. Read it first (step 1 in `AGENTS.md`), and add to it when you learn something that isn't obvious from the code.

If the `basic-memory` MCP server is connected, use its search and write tools. Otherwise, read and edit the files directly. Both stay in sync.

## Note format

```markdown
---
title: Saves in private browsing
type: issue
permalink: saves-in-private-browsing
tags: [saves, safari]
---

# Saves in private browsing

## Observations
- [problem] Safari private windows refuse IndexedDB writes with Blobs #saves
- [fix] The SDK stores Blobs as bytes, so this works since SDK 0.4.0

## Relations
- part_of [[Game architecture]]
- relates_to [[Save format]]
```

* One note per topic. Update the existing note rather than creating a near duplicate.
* `type` is one of `decision`, `issue`, `howto` or `concept`.
* Observations are `- [category] fact`, with `#tags` and optional `(context)`.
* Relations are `- relation_type [[Note title]]`, and link notes into the graph.
* Never write secrets, tokens or players' personal data into memory.
