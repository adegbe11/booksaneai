# Verification record

This record describes local evidence for Booksane Studio, not a certification or a claim of superiority over other software.

## Automated checks

- TypeScript checking and optimized Next.js production build pass.
- 11 unit tests pass, covering preservation, safe serialization, project round trips, EPUB packaging, and atomic IndexedDB saving/checkpoints.
- Browser tests exercise the production application in Chromium: editing and persistence across reloads, section operations, DOCX emphasis/table preservation, project restore, measured preview, actual PDF/EPUB downloads, and mobile layout.
- The author workflow compares measured preview page count against downloaded PDF page count, checks the 6 × 9 inch PDF dimensions, and checks exported manuscript content.

## Export inspection

The tested sample EPUB passes EPUBCheck 5.4.0 with zero errors and zero warnings. The tool runs externally during verification; the application does not run it automatically for every export.

The sample PDF has eight pages at 432 × 648 points. Text extraction confirms the edited manuscript survives export. Both used fonts, EB Garamond and Inter, are embedded. Rendered pages have been visually inspected for text layout, section transitions, contents references, page numbers, running heads, and blank-page suppression.

Test outputs are generated under ignored `artifacts/`. Browser traces and failure reports are generated under ignored `test-results/`.

## Limits of this evidence

These checks cover representative local workflows. They do not establish full EPUB accessibility, PDF/X compliance, physical printer approval, cross-browser compatibility, or multilingual typography. Large projects, complex imported material, browser storage quotas, and concurrent editing in multiple tabs require broader testing. Accounts, billing, cloud sync, collaboration, durable export jobs, and production access control are not implemented.

## Production browser result

All seven Chromium integration tests pass against `next start` on port 3100. The long-manuscript test imports approximately 20,000 words, composes more than 30 pages, changes the trim from 6 × 9 to 5 × 8 inches, and confirms that the recomposed book requires more pages. This is a representative stress check, not a universal manuscript-size guarantee.

The September 30 clarity update additionally tests named-book setup, input focus, optional guidance, help reopening, writing/design separation, selected style state, fine-control disclosure, native-dialog Escape and focus return, and the actual import file-picker path. Print preview is checked to open at the selected chapter. The optimized build, TypeScript check, and 11 unit tests also pass. These checks establish working interactions; first-time-author comprehension still requires a participant study.
