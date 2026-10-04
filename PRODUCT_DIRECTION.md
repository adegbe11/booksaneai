# Booksane Studio

Booksane is a publishing workspace: a calm place to shape a manuscript into a book, with visible evidence behind every publishing decision.

## Product idea

The distinguishing feature is accountable publishing. A project includes semantic manuscript content, book design, recovery history, import findings, and an export review tied to a revision. The author always knows what was preserved, what needs attention, and what has actually been verified.

The interface has a library, manuscript workspace, design workspace, and publication review. Use a warm paper palette, forest-green controls, restrained serif typography, and generous reading space. Keep writing separate from layout so the author can focus. Advanced controls belong near the relevant content.

The September 30 clarity revision adds explicit import/write/sample starting paths, optional book setup, import preparation, contextual guidance, reopenable workflow help, representative style pages, and preview navigation to the selected chapter. The evidence and competitor workflow comparison are in `ONBOARDING_RESEARCH.md`. Clarity is a task-completion and comprehension requirement, not an aesthetic claim.

## Rebuilt foundations

- Versioned semantic document schema, validated on project restore and PDF submission.
- Schema-based rich editing using Tiptap, with undo/redo, subheads, emphasis, lists, tables, and embedded PNG/JPEG images.
- IndexedDB project saving, recoverable checkpoints, portable files, and recovery of previous Booksane documents.
- Structured DOCX import with chapter-boundary detection and conversion reports. Original files remain on the author's device; they are not stored by this version.
- Measured paged-media preview and server-generated PDF using the same HTML/CSS pipeline and local font files.
- Semantic EPUB including front matter, chapters, back matter, and packaged images.
- Revision-specific content findings and truthful validation status.

## Work required before a production release

This rebuild is a working foundation, not a claim of market superiority. It needs external EPUBCheck/accessibility validation, destination-specific print preflight, embedded-font inspection, physical printer proofs, footnotes/endnotes, indexes, stronger multilingual coverage, long-manuscript performance profiling, browser compatibility checks, migration fixtures, user research, and independent typography reviews.

The PDF route runs a local bundled browser. Hosted deployment must provision its browser dependencies, restrict access, enforce request/job limits, and configure durable background exports. No accounts, billing, cloud sync, or public deployment are implemented here.

## Acceptance principle

Measure quality through preserved content, recoverable edits, reproducible exports, accessible reading, physical proofs, and successful author tasks. A polished interface is necessary; evidence makes it trustworthy.
