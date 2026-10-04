# Booksane Studio

A publishing workspace built with Next.js, React, and TypeScript. Start at `/` for the introduction or `/editor` for the library.

## Run locally

```sh
npm ci
npm run dev
```

Puppeteer installs its browser during dependency installation. If downloads were disabled, run `npx puppeteer browsers install chrome`. PDF exports require a Node server and browser dependencies; they cannot run on static hosting.

## What works

- Rich manuscript editing, section organization, and semantic DOCX/TXT import with review reports.
- IndexedDB autosaving, ten local checkpoints, and editable `.booksane` project backups.
- Three design directions, four trim sizes, measured print preview, and PDF export using the same layout engine.
- EPUB export with navigation, front/back matter, semantic content, and packaged PNG/JPEG images.
- Content checks and revision-specific export review.

Books remain in this browser on this device. Clearing browser data removes saved projects. Export backups regularly. PDF submission sends the current project to the application's server; in this local build that server runs on your machine.

## Verify

```sh
npm run typecheck
npm test
npm run build
```

For browser integration tests, run an application server on port 3101, then `npm run test:browser`. Set `BOOKSANE_TEST_URL` to test another server. Tests use Puppeteer's installed Chromium with Playwright.

See `BOOKSANE_RESEARCH.md` for publishing research, `ONBOARDING_RESEARCH.md` for competitor first-use workflows and the clarity redesign, `PRODUCT_DIRECTION.md` for production requirements, and `VERIFICATION.md` for current evidence. Exports need reader and printer review; this application does not certify EPUB accessibility, PDF/X, or publisher acceptance.
