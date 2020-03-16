const path = require('path');

const libName = 'async-thread-worker';
const outDir = path.join(__dirname, '../../target');
const __modPath = `${outDir}/${libName}.min.js`;
// const __modPath = `${outDir}/${libName}.js`; // dev !!!!
const Mod = require(__modPath);

test('load', () => {
    expect(Mod.hasOwnProperty('Thread')).toBe(true);
    expect(Mod.hasOwnProperty('ThreadWorker')).toBe(true);
});

// Skip if v10.x which requires `--experimental-worker` for 'worker_threads'
if (process.version > 'v12.') {
    const test00 = () => {}; // just for easy toggling on/off tests

    // kludge: make sure `global.require` inside `Mod` is available
    global.require = require;

    test('raw ping', async () => {
        const content = `
const { parentPort } = require('worker_threads');
parentPort.once('message', msg => parentPort.postMessage({ pong: msg }));
        `;
        const { Worker } = require('worker_threads');
        const wk = new Worker(content, { eval: true });
        const ping = () => new Promise((res, rej) => {
            wk.on('message', msg => res(msg));
            wk.postMessage('ping');
        });

        const msg = await ping();
        wk.terminate();

        expect(msg['pong']).toBe('ping');
    });

    //

    test('simple', async () => {
        const content = `
const Mod = require('${__modPath}');

class MyThreadWorker extends Mod.ThreadWorker {
    onRequest(id, payload) { // impl
        // throw [id, payload]; // debug
        this.sendResponse(id, payload.toUpperCase());
    }
}

const _thw = new MyThreadWorker(this, { isNode: true });
// throw [typeof _thw]; // debug
        `;

        const th = new Mod.Thread(content, {
            isNode: true,
            optsNode: { eval: true }, // https://nodejs.org/api/worker_threads.html#worker_threads_new_worker_filename_options
        });

        const result = [];
        for (let payload of ['a', 'b', 'c', 'd']) {
            result.push(await th.sendRequest(payload));
        }

        // !! Do call this BEFORE any `expect()`s, or the test could hang !!
        th.terminate();

        expect(result.join('')).toBe('ABCD');
    });

    //

    test('api terminate() exit code', async () => {
        const content = `
const Mod = require('${__modPath}');
const _thw = new Mod.ThreadWorker(this, { isNode: true });
        `;
        const th = new Mod.Thread(content, {
            isNode: true,
            optsNode: { eval: true },
        });
        const exitCode = await th.terminate();
        expect(exitCode).toBe(0);
    });

    //

    test('api terminate() canceled', async () => {
        const content = `
const Mod = require('${__modPath}');
const _thw = new Mod.ThreadWorker(this, { isNode: true });
        `;
        const th = new Mod.Thread(content, {
            isNode: true,
            optsNode: { eval: true },
        });

        setTimeout(() => th.terminate(), 50);

        let result;
        try {
            result = await th.sendRequest('ping');
        } catch (err) {
            result = err;
        }
        expect(result.startsWith('canceled:')).toBe(true);
    });

    //

    test00('-', async () => {
    });
    test00('-', async () => {
    });
}
