import { fileURLToPath } from 'node:url';

export default { outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)), serverExternalPackages: ['puppeteer'], outputFileTracingIncludes: { '/api/publish/pdf': ['./public/fonts/*', './public/layout/*'] } };
