const path = require('path');
const fs = require('fs-extra');
const { Server } = require('es-pack-js');

const libName = 'async-thread-worker';
const outDir = path.join(__dirname, '../../target');
const modPath = `${outDir}/${libName}.min.js`;
// const modPath = `${outDir}/${libName}.js`; // dev !!!!

const tmpModPath = `${__dirname}/__atw.min.js`;

let output;

let server = null;
beforeAll(async () => {
    const serveDir = __dirname;
    server = await (new Server(serveDir)).listen();

    fs.copySync(modPath, tmpModPath);

    const page = await browser.newPage();
    await page.goto(`http://localhost:${server.port}/index.html`);

    expect(await page.title()).toBe('tests');

    // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagewaitforfunctionpagefunction-options-args
    await page.waitForFunction(`typeof window.output === "object"`);
    output = await page.evaluate(() => window.output);

    fs.removeSync(tmpModPath);
});
afterAll(async () => {
    server.close();
    server = null;
});

test('output', () => {
    expect(typeof output).toBe('object');
    expect(output.baseUrl.startsWith('http://')).toBe(true);
});
test('simple', () => expect(output.result.simple).toBe('ABCD'));
test('api terminate() canceled', () =>
    expect(output.result.terminate.startsWith('canceled:')).toBe(true));
