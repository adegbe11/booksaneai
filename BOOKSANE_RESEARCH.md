# Booksane: research for a world-class book-formatting product

Research date: September 29, 2026. Evidence comes from product documentation, publishing specifications, and maintainer documentation. This is desk research and a source-code review, not a hands-on competitor benchmark. The targets below are proposed Booksane acceptance criteria, not measured performance or established industry requirements unless explicitly attributed.

## Executive decision

Make Booksane excellent at preserving manuscripts, composing beautiful books, and proving export quality. Build a trustworthy text-book workflow first, with an architecture capable of complex nonfiction. Evaluate sophistication through finished books and author outcomes. A large template gallery or AI button is insufficient evidence of quality.

The strongest opportunity is an approachable workflow with unusually transparent quality control: authors see exactly what imported successfully, why a layout decision was made, what changed between revisions, and which export checks passed. This opportunity is a product hypothesis requiring user research.

## 1. Typography is a composition problem

Vellum already prevents certain widows and orphans, balances spreads, clarifies scene breaks at page edges, avoids short paragraph-ending words, keeps subheads with following text, and tries to lengthen sparse chapter-ending pages. It explicitly acknowledges tradeoffs between widow prevention and spread balance. Booksane needs comparable controls and a way to review exceptions. [Vellum automatic print layout](https://www.help.vellum.pub/print/auto-layout/).

Adobe exposes composition choices that evaluate line breaks against hyphenation and justification settings. This supports treating paragraph composition as an engine capability, rather than assuming that applying justified CSS is enough. [Adobe composition documentation](https://helpx.adobe.com/uk/indesign/desktop/format-and-style-text/composition-and-text-wrapping/set-text-composition.html).

Proposed controls: paragraph styles, font and size, line spacing, measure, indentation, keep-with-next, language-specific hyphenation, chapter opening position, recto starts, widow/orphan policy, running heads, and visible layout exceptions. Retain author overrides across reflow. Keep poetry line breaks explicitly rather than guessing from whitespace.

## 2. Print readiness depends on the destination

KDP requires separate interior and cover files. Interior pages are submitted individually within the file, rather than as reader spreads; fonts must be embedded. A 6 × 9 inch bleeding interior uses a 6.125 × 9.25 inch page. The required inside margin increases with page count, so validation must run after pagination. [KDP paperback requirements](https://kdp.amazon.com/en_US/help/topic/G201857950), [trim, bleed, and margins](https://kdp.amazon.com/en_US/help/topic/GVBQ3CMEQW3W2VL6).

IngramSpark's linked guide specifies PDF/X-1a:2001 or PDF/X-3:2002 for its color-text workflow, single-page interiors, and no crop/registration marks. It specifies CMYK and 300 ppi for color text images. These are profile-specific requirements, not a universal definition of a good PDF. Its PDF bears a 2024 date; confirm requirements again before shipping an export profile. [IngramSpark file creation guide](https://www.ingramspark.com/hubfs/downloads/file-creation-guide.pdf).

Decision: offer versioned destination profiles. Each export report records destination, trim, bleed, final page count, font status, image-resolution findings, renderer version, and validation results. Cover generation depends on the final interior and the chosen provider's current cover template. Never invent ISBNs, copyright ownership, or publisher metadata.

## 3. EPUB and accessibility require separate validation

Use EPUB 3.3 as the specification baseline. A valid package needs correct metadata, reading order, navigation, resources, and content documents. Print settings and ebook settings must be separate: ebook text should adapt to the reading system. [W3C EPUB 3.3](https://www.w3.org/TR/epub-33/).

Accessibility is part of the source document: heading hierarchy, meaningful navigation, document language, image descriptions, table structure, and linked notes. Publish truthful discoverability metadata and a useful accessibility summary when appropriate. [EPUB Accessibility 1.1](https://www.w3.org/TR/epub-a11y-11/).

EPUBCheck checks standard conformance; it does not prove good reader behavior or complete accessibility. Ace checks automatically detectable accessibility issues, while SMART supports human evaluation. A clean automated report cannot establish all accessibility claims. [DAISY EPUBCheck guidance](https://kb.daisy.org/publishing/docs/epub/validation/epubcheck.html), [Ace guidance](https://kb.daisy.org/publishing/docs/epub/validation/ace.html), [SMART evaluation workflow](https://smart.daisy.org/user-guide/overview.html).

Decision: retain validation reports with the export revision. Distinguish “package checks passed,” “automated accessibility checks passed,” and “human review completed.” Test navigation, notes, image descriptions, font resizing, and reading order in real reader applications.

## 4. Import fidelity is foundational

Mammoth's `extractRawText` ignores document formatting. Booksane currently uses this method in both import paths. Its `convertToHtml` produces HTML and conversion messages, but the maintainer warns that it does not sanitize the document. [Mammoth documentation](https://github.com/mwilliamson/mammoth.js).

Decision: convert DOCX into a supported semantic schema, sanitize the conversion, preserve original files, and show a review report. Unsupported objects remain visible as findings; never silently delete them. Compare extracted source text and imported text, with documented normalization rules. Ask authors to resolve ambiguous chapter boundaries rather than confidently guessing.

## 5. Adopt a structured editing foundation

Tiptap's ProseMirror-based model represents documents through a schema, nodes, marks, and transactions. Its documentation recommends JSON persistence rather than relying on saved HTML alone. [Tiptap concepts](https://tiptap.dev/docs/editor/core-concepts/introduction), [persistence](https://tiptap.dev/docs/editor/core-concepts/persistence).

Recommendation: evaluate Tiptap/ProseMirror for the editing foundation. Store stable section and block IDs, semantic content, metadata, assets, and revision information in a versioned project format. Treat layout as derived output. Check licenses and paid-extension requirements before selecting pagination or review extensions.

Proposed experience: a book navigator, focused manuscript editor, and synchronized preview; advanced controls appear when relevant. Support keyboard editing, undo/redo, search, chapter reordering, visible save status, and revision recovery. AI suggestions should be explicit, reversible, and separate from author text.

## 6. Choose the print engine through a measured prototype

| Candidate | Verified capability | Evaluation question |
| --- | --- | --- |
| Paged.js plus a pinned browser renderer | Browser pagination, paged-media transformations, extensible handlers, PDF generation through its CLI | Can the same layout drive preview and exported pages accurately for our fixtures? |
| WeasyPrint service | HTML/CSS rendering designed for pagination; font configuration and PDF generation | Does its output outperform the browser approach on notes, tables, typography, and long books? |
| Current Booksane paginator | Character-count estimates and miniature preview rendering, observed in source | Suitable only as a clearly marked approximate preview |

Paged.js documents generated content for running heads, page numbers, and other navigation. [Maintainer README](https://github.com/pagedjs/pagedjs/blob/main/README.md), [generated-content documentation](https://pagedjs.org/en/documentation/6-generated-content/).

WeasyPrint documents PDF/A and PDF/UA variants, with an explicit warning that compliance is not guaranteed merely by selecting an option. Its documentation also warns that major versions can change rendering. These capabilities do not establish PDF/X support or printer acceptance. [WeasyPrint overview](https://doc.courtbouillon.org/weasyprint/stable/index.html), [PDF variants](https://doc.courtbouillon.org/weasyprint/latest/common_use_cases.html), [versioning and API](https://doc.courtbouillon.org/weasyprint/latest/api_reference.html).

Decision: prototype both engines against the same document schema and licensed font set. Pin dependencies and fonts; compare extracted text, page geometry, overflow, notes, page references, and visual quality. Select based on results. Do not write a new typesetting engine before measuring mature options.

## 7. International publishing needs its own fixtures

Language-dependent line breaks and bidirectional text complicate typography. Unicode support alone is insufficient evidence of correct book layout. [W3C line-breaking guidance](https://www.w3.org/International/articles/typography/linebreak.en).

Proposed fixtures: English fiction; diacritics in names and African-language text; Arabic with mixed English; Devanagari; CJK; mathematical notation. Add language metadata, appropriate fonts, and locale-aware typography. Publish a tested language-support matrix rather than claiming universal support immediately.

## Proposed release scorecard

| Area | Acceptance target | Evidence |
| --- | --- | --- |
| Manuscript preservation | No unexplained text or semantic loss in supported imports and project round-trips | Source/import/export comparisons and conversion reports |
| Print consistency | Preview and final PDF share page boundaries, contents references, and layout revision | Automated geometry checks plus rendered-page comparison |
| Typography | No clipping or unresolved keep violations; exceptions to aesthetic policies are visible | Layout findings and professional human review |
| EPUB | Zero EPUBCheck errors; warnings reviewed; accessibility findings resolved or explicitly described | Stored validator reports and reader tests |
| Recovery | Restore an edited project after reload and simulated interrupted saving | Browser integration tests and backup round-trips |
| Performance | Proposed p95 editing response under 100 ms on a named reference machine; benchmark 100,000-word books | Reproducible timings, memory measurements, and full-layout duration |
| Ease of use | Proposed 8 of 10 first-time authors complete a simple import-to-export task without coaching | Observed usability study with fixed tasks |
| Competitive quality | Favorable results against equivalent competitor output for the same manuscripts | Blind book-design review and timed author tasks |

Aesthetic constraints can conflict. Do not fail a book simply because every spread is not balanced; record policy, exceptions, and reviewer judgment. The numeric targets above are hypotheses to validate, not promises.

## Booksane gaps found in the source review

1. Preview page boundaries use character estimates rather than measured typesetting.
2. DOCX import drops formatting.
3. Basic EPUB output omits existing front/back matter and lacks complete asset packaging and external validation.
4. The current editor's editable HTML is not a versioned semantic document model.
5. Projects use localStorage without revision history or durable asset storage.
6. Preview copyright pages contain fabricated ISBN placeholders and label Booksane as publisher.
7. Print proofs do not yet guarantee embedded fonts, running page numbers, or destination certification.

## Implementation order

First: preserve existing projects; introduce the document schema, migrations, durable saving, and structural DOCX import with reports.

Second: complete semantic EPUB export and automated validation. This provides a verifiable publishing result before tackling every complex layout feature.

Third: run the print-engine comparison and replace character-count pagination with the winning measured pipeline. Make preview, contents, and PDF refer to one layout result.

Fourth: add native tables, notes, images, indexes, and international fixtures with acceptance tests.

Finally: conduct author studies, commission independent book-design reviews, and test physical proofs. Claim comparative superiority only for the workflows those results substantiate. “Best ever built in human history” is an ambition that this research cannot establish.
