#!/usr/bin/env node

global.require = require; // kludge: make sure `global.require` inside the async-thread-worker module is available

const modPath = '../../dist/async-thread-worker.min.js';
const code = `
const { ThreadWorker } = require('${modPath}');

class MyThreadWorker extends ThreadWorker {
    async onRequest(id, payload) {
        try {
            await MyThreadWorker.sleep(1000);
            this.sendResponse(id, payload.toUpperCase());
        } catch (err) {
            this.sendError(id, err);
        }
    }

    static async sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
}
const _thw = new MyThreadWorker(this, { isNode: true });
`;

const { Thread } = require(modPath);
const th = new Thread(code, {
    isNode: true,
    optsNode: { eval: true }, // https://nodejs.org/api/worker_threads.html#worker_threads_new_worker_filename_options
});

(async () => { // main
    const result = [];
    for (let payload of ['a', 'b', 'c', 'd']) {
        result.push(await th.sendRequest(payload));
        console.log('result:', result);
    }

    th.terminate();
})();