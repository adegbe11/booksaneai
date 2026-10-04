# Booksane: onboarding and clarity research

Research date: September 30, 2026.

## Evidence and limits

This study examines official help, documented first-use workflows, and published interface images. Vellum's style-selection image and Atticus's starting-dashboard image were inspected in the browser. These are documented competitor experiences, not hands-on tests of paid applications or evidence that Booksane outperforms them. The earlier automated tests established functionality, not usability.

## Patterns worth learning from

| Reference | Observed pattern | Booksane decision |
| --- | --- | --- |
| Apple onboarding | Brief, optional learning; interactive tasks; contextual tips; deferred nonessential setup | Teach through a real book. Make setup optional and help reopenable. |
| Vellum startup | Separate new-book and Word-import choices with tutorial access | Start with author intent: existing manuscript or new writing. |
| Vellum tutorial | Prepared manuscript guides navigation, styling, matter, saving, and preview | Provide an editable sample with guidance alongside the work. |
| Vellum styles | Representative pages communicate styles before configuration | Show page samples and plain descriptions; disclose finer controls separately. |
| Atticus quick start | Dashboard entry paths, practice material, save feedback, writing then formatting | Explain stages and storage; do not require a video to begin. |
| Atticus import | File choice/drop area, metadata, explicit recognition rules | Explain formats and Heading 1 before import, findings afterward. |
| Reedsy start | Bookshelf leads to creation/import, writing, and export | Make saved work easy to resume. |
| Kindle Create import | Authors review and accept suggested chapter headings | Detection needs author review; an editable boundary-review flow remains a gap. |
| Kindle Create publication | Import, style, preview, generate, preserve editable project | Explain publication formats and editable backup separately. |
| Scrivener learning | Interactive tutorial stays accessible from Help | Learning must remain available after the first launch. |

Sources:

- [Apple onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding?changes=_7) and [offering help](https://developer.apple.com/design/human-interface-guidelines/offering-help?changes=_7)
- [Vellum startup](https://help.vellum.pub/startup-window/), [tutorial](https://help.vellum.pub/tutorial/), [styles](https://help.vellum.pub/styles/), [published style interface](https://help.vellum.pub/styles/images/popular-styles.png), and [preview](https://help.vellum.pub/preview/)
- [Atticus quick start](https://www.atticus.io/quick-start-guide/) and [import guide](https://www.atticus.io/importing-existing-work/). The latter carries an October 2022 update date and does not prove every current interface detail.
- [Reedsy starting workflow](https://reedsy.com/faq/studio-app/about-reedsy-studio/find-studio-app)
- [Amazon chapter review and import](https://kdp.amazon.com/en_US/help/topic/G7R2L7V5X6SJH948) and [publication workflow](https://kdp.amazon.com/en_US/help/topic/G93BCLJGZFGK39BT)
- [Literature & Latte tutorial access](https://www.literatureandlatte.com/learn-and-support/video-tutorials)

## Observed Booksane failures

The opening screen emphasized decoration and general promises. Creation immediately exposed an unnamed manuscript, metadata, and design controls. Authors had to infer the workflow, section terminology, storage location, and differences between PDF, EPUB, and backups. Style tiles communicated little about actual pages. Help was absent. These findings come from Booksane's interface and source, not assumptions about competitor usability.

## Implemented response

1. Task-based starting choices explain import and writing; the sample is an explicit learning path.
2. Title/author setup names the next action and can be skipped.
3. Import onboarding supports file choice and drop, with preparation and storage explanations.
4. Context guidance explains the current task and a direct next action.
5. Guidance is dismissible and help can be reopened. Native onboarding dialogs handle keyboard focus, Escape, and focus return.
6. Writing shows book metadata; design shows style and trim. Fine typography is collapsed initially.
7. Representative style pages have descriptive labels and selected states. The actual manuscript preview remains authoritative.
8. Storage explanations explicitly identify this browser and device.
9. Print preview opens at the selected manuscript section and follows chapter selection, so style changes are seen in context rather than only on a title page.

## Competitive ambition and remaining work

A shorter path to a trustworthy first proof is a product hypothesis, not an established competitive win. Vellum's documented composition and styling capabilities remain substantially more developed.

Next: editable import-boundary review, semantic matter types, cover handling, composition and hyphenation evaluation, footnotes, richer chapter openings, accessible reader preview, revision-bound export validation, multi-tab conflict handling, and storage-failure recovery.

Use the same manuscripts and tasks in each tool with first-time authors. Measure import fidelity, correct chapter structure, time to useful preview, comprehension of file types and storage, recovery, successful exports, and requests for help. Include both blank-page writers and authors with completed manuscripts. Automated completion cannot establish comprehension.

Proposed acceptance: an unfamiliar author can choose a starting path, create a named book, locate a chapter, change a style, explain PDF/EPUB/backup, and recover their work without coaching. A participant study has not yet been conducted.
