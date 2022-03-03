const path = require('path');

const libName = 'async-thread-worker';
const outDir = path.join(__dirname, '../../target');
const __modPath = `${outDir}/${libName}.min.js`;
//const __modPath = `${outDir}/${libName}.js`; // dev
const Mod = require(__modPath);

test('load', () => {
    expect(Mod.hasOwnProperty('Thread')).toBeTruthy();
    expect(Mod.hasOwnProperty('ThreadWorker')).toBeTruthy();
});

// Skip if v10.x which requires `--experimental-worker` for 'worker_threads'
if (process.version > 'v12.') {

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
        expect(result.startsWith('canceled:')).toBeTruthy();
    });

    //

    test('_onError()', async () => {
        const content = `
const Mod = require('${__modPath}');

class MyThreadWorker extends Mod.ThreadWorker {
    onRequest(id, payload) { // impl
        if (payload === 2) throw 42;

        this.sendResponse(id, payload + 100);
    }
}

const _thw = new MyThreadWorker(this, { isNode: true });
        `;

        const th = new Mod.Thread(content, {
            isNode: true,
            optsNode: { eval: true },
        });

        const results = [];
        for (let i = 0; i < 4; i++) {
            try {
                results.push(await th.sendRequest(i));
            } catch (err) { // `_cancelPendingRequests()` kicks in
                results.push(err);
                break;
            }
        }

        expect(results.length).toBe(3);
        expect(results[0]).toBe(100);
        expect(results[1]).toBe(101);
        expect(results[2].startsWith('canceled:')).toBeTruthy();
    });
}
