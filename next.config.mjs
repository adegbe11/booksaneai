import { fileURLToPath } from 'node:url';

export default { outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)), serverExternalPackages: ['puppeteer', 'puppeteer-core', '@sparticuz/chromium'], outputFileTracingIncludes: { '/api/publish/pdf': ['./public/fonts/**/*', './public/layout/*', './node_modules/@sparticuz/chromium/bin/**'] } };
