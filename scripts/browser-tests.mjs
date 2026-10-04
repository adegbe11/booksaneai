import puppeteer from 'puppeteer';
import { spawn } from 'node:child_process';
const executablePath = await puppeteer.executablePath();
const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], { stdio: 'inherit', env: { ...process.env, BOOKSANE_TEST_BROWSER: executablePath } });
child.on('exit', code => process.exit(code || 0));
