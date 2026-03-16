---
name: tab-generator
description: Generate guitar tab JSON files matching the project's schema for any given song and artist. Use this when you need to create a new tab for a song that isn't already in the database.
---

# Tab Generator

## Overview

This skill enables the generation of structured guitar tab JSON files. It ensures that the generated content is complete (full song) and strictly adheres to the project's data schema.

## Workflow

1.  **Identify Song & Artist:** Determine the song title and artist name.
2.  **Consult Schema:** Read and follow the `data/schemas/tab_schema.json` to ensure all required fields are present and correctly formatted.
3.  **Generate Content:**
    *   Create a complete set of tabs for the entire song (Intro, Verses, Choruses, Bridge, Outro).
    *   Ensure each section contains `lines` with both `lyrics` and correctly positioned `chords`.
    *   Populate metadata: `difficulty`, `tuning`, `capo`, `key`, and `chords_required`.
4.  **Validate:** Verify the JSON against the schema.
5.  **Save:** Save the generated JSON to `data/tabs/<song-name>-<artist-name>.json` (kebab-case).

## Guidelines

- **Completeness:** Do not truncate the song. Include all sections.
- **Accuracy:** Chords must be accurately placed using the `position` index (character index in the `lyrics` string).
- **Format:** Use `kebab-case` for the filename.

## References

- [Tab Schema](../../data/schemas/tab_schema.json): The official JSON schema for guitar tabs in this project.
