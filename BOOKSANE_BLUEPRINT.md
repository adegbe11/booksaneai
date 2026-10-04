# Booksane: product and engineering blueprint

The supporting [world-class product research](BOOKSANE_RESEARCH.md) adds publishing standards, engine choices, source-code gaps, and proposed acceptance benchmarks.

## Product promise

Turn a finished manuscript into a beautiful, editable book with clear evidence that its exports are ready for the intended destination. Start with novels, memoirs, and text-heavy nonfiction on Windows and Mac. Expand into complex publishing only after the core produces reliable files.

The ambition is to combine Vellum's approachable workflow, Atticus's cross-platform access, and professional layout control. Superiority must be demonstrated with output comparisons and author testing; it cannot be claimed from a new interface alone.

## The experience

1. Create a genuinely blank book, open a saved project, or import a manuscript. Offer the sample book as an explicit choice.
2. Review an import report: detected chapters, retained formatting, unsupported elements, and ambiguous headings. Never silently discard text.
3. Edit a structured document. Organize front matter, parts, chapters, and back matter. Offer undo/redo and recoverable snapshots.
4. Choose a genre-appropriate theme, then customize typography, trim size, margins, chapter openings, running heads, and scene breaks. Save reusable styles.
5. Preview print at actual trim proportions and ebooks on different screen sizes. Clicking a chapter opens the corresponding location. Distinguish approximate preview from measured pagination.
6. Resolve actionable preflight findings. Link each finding to its source and explain the remedy.
7. Export a print interior, ebook, or editable project. Report the exact validation performed; never label a browser print proof as certified press-ready.

## How to compete

| Competitor strength | Booksane target | Evidence required |
| --- | --- | --- |
| Vellum: book-specific automation | Fast formatting with widow/orphan control, balanced spreads, accurate contents, and consistent recto starts | Blind comparison of printed samples plus measured layout tests |
| Atticus: access across platforms | Reliable Windows/Mac workflow with local recovery and portable project files | Reopen and backup round-trip tests across browsers |
| InDesign: production control | Progressive controls for sophisticated nonfiction without making simple books difficult | Tables, notes, anchored images, indexes, and printer-approved output |
| Affinity: strong free layout | Clear advantage in book automation and validation | Time-to-finished-book tests against equivalent projects |
| Reedsy: easy free formatting | A useful free workflow and clearly priced advanced features | Successful first export by new authors without assistance |

## Architecture

Use one versioned structured document as the source of truth. Preserve immutable section IDs, semantic paragraphs, heading levels, emphasis, lists, tables, notes, images with alt text, and publication metadata. Separate the document from print settings and ebook settings. Both export engines consume this same document; neither consumes miniature preview HTML.

Import DOCX structurally, with an explicit conversion report and safe HTML handling. Preserve a copy of the original manuscript. Add PDF import only with actual extraction, reading-order review, and clear OCR limitations.

Use IndexedDB for projects, assets, and revision snapshots. Keep a small recent-project index separately. Autosave visibly reports success or failure. Portable backups include a schema version and assets; restore validates the schema and sanitizes content. Optional account sync requires conflict resolution and restore history.

Build print with measured typesetting and a pinned font set. Wait for fonts and images, compute page breaks, enforce keep-with-next and widow/orphan rules, generate page numbers and contents from final pagination, and produce PDFs through a controlled rendering pipeline. Embed licensed fonts and validate page boxes. Add PDF/X only through a pipeline that actually implements and verifies it.

Build semantic EPUB 3 with navigation, metadata, front/back matter, packaged assets, linked notes, and reader-respecting CSS. Validate XHTML and the package, then run EPUBCheck and accessibility checks. Test resulting files in reader applications and retailer previewers.

## Delivery phases and acceptance gates

### Phase 1 — trustworthy foundation

Runnable isolated project; edits survive reopen; renaming reaches previews and exports; accurate live word counts; safe manuscript text; useful document checks; honest print-proof labeling; backups and tested restoration. Acceptance: no text loss in import/edit/save/reopen/export fixtures.

### Phase 2 — competitive text-book release

Structured DOCX import, semantic editor, undo/redo, editable author metadata, section management, customizable themes, measured print pagination, page numbering, running heads, contents generation, and complete EPUB front/back matter. Acceptance: validated EPUBs and approved print proofs for novels, memoirs, and nonfiction fixtures, including a long manuscript.

### Phase 3 — advanced nonfiction

Native tables, linked footnotes/endnotes, images and captions, lists, callouts, indexes, bleed, large print, and accessibility controls. Acceptance: each content type round-trips and exports without rasterizing searchable text unnecessarily.

### Phase 4 — publishing teams

Optional sync, revisions, review comments, reusable brand themes, batch exports, permissions, and collaboration. Acceptance: documented conflict recovery, tested backups, and reliable exports from the same revision.

## Quality benchmark

Maintain fixtures for short fiction, long fiction, poetry, memoir, academic notes, tables, illustrated nonfiction, Unicode, and malicious pasted markup. Check preservation of text and semantic content, not merely page count. Include visual comparison after font loading and automated EPUB/package validation. Conduct timed user trials and blind typography reviews before advertising comparative claims.

## Current implementation limits

The existing paginator estimates page boundaries by character count and draws miniature pages. It is a preview approximation. The revised print proof uses full manuscript content and browser pagination, but does not yet provide production pagination, running page numbers, font embedding guarantees, PDF/X certification, or printer approval. EPUB needs front/back matter, asset packaging, XHTML normalization, external validation, and reader QA. localStorage saving is a temporary foundation, not a replacement for durable project storage and revision history.

## Research basis

Product documentation checked September 29, 2026:

- [Vellum](https://vellum.pub/) and [licensing](https://help.vellum.pub/purchasing/)
- [Atticus](https://www.atticus.io/) and [table limitations](https://intercom.help/atticus-5877e36564df/en/articles/12683623-can-i-use-tables-charts-in-atticus)
- [Adobe book workflow](https://helpx.adobe.com/vn_en/indesign/using/creating-book-files.html) and [EPUB options](https://helpx.adobe.com/indesign/desktop/save-export-and-publish/export-to-epub/epub-export-options.html)
- [Affinity layout and export capabilities](https://www.affinity.studio/page-layout-software)
- [Reedsy formatting](https://reedsy.com/studio/format-a-book/)
