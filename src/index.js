// async-thread-worker - https://github.com/w3reality/async-thread-worker
// async/await abstraction for Web Workers (MIT License)

const __version = "0.9.3dev";
const __consoleLog = (...args) => {
    const _console = console;
    _console.log.apply(_console, args);
};
const __consoleVer = name => __consoleLog(`${name} ${__version}`);

class ThreadWorker {
    constructor(self, opts={}) {
        __consoleVer('AsyncThreadWorker.ThreadWorker');

        // https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self
        this._worker = self;
        self.onmessage = e => this._onMessage(e);

        this.onCreate(opts);
    }
    onCreate(opts) {}

    _onMessage(e) {
        const { id, data } = e.data;
        this.onRequest(id, data);
    }

    // abstract
    onRequest(id, payload) {}

    _sendResponse(id, data, opts={}) {
        const defaults = {
            transferables: [],
            error: undefined,
        };
        const actual = Object.assign({}, defaults, opts);
        const error = actual.error;
        this._worker.postMessage({
            id: id,
            result: { data, error },
        }, actual.transferables.length > 0 ? actual.transferables : undefined);
    }
    sendResponse(id, payload=undefined, transferables=[]) {
        this._sendResponse(id, payload, { transferables });
    }
    sendError(id, error) {
        this._sendResponse(id, undefined, { error });
    }
}

class Thread {
    constructor(path) {
        __consoleVer('AsyncThreadWorker.Thread');

        const _worker = new Worker(path);
        this._worker = _worker;

        this._rrRequest = {};
        _worker.onmessage = (e) => {
            if (0 && e.data.debug) {
                console.log('debug:', e.data.debug);
                return;
            }

            const { id, result } = e.data;
            console.log('result for id:', id);

            const { data, error } = result;
            if (id in this._rrRequest) {
                const { res, rej } = this._rrRequest[id];
                delete this._rrRequest[id];
                error ? rej(error) : res(data);
            } else {
                console.log('nop; invalid request id:', id);
            }
        };
    }
    _sendRequest(data, opts={}) {
        const defaults = {
            transferables: [],
        };
        const actual = Object.assign({}, defaults, opts);
        return new Promise((res, rej) => {
            let id;
            do {
                id = `req-id-${Math.random()}`;
            } while (id in this._rrRequest);

            console.log('_sendRequest(): id:', id);
            this._rrRequest[id] = { res, rej };

            if (this._worker) {
                this._worker.postMessage({ id, data },
                    actual.transferables.length > 0 ? actual.transferables : undefined);
            } else {
                console.log('_sendRequest(): nop (worker already terminated?)');
            }
        });
    }
    sendRequest(payload=undefined, transferables=[]) {
        return this._sendRequest(payload, { transferables });
    }
    getWorker() {
        return this._worker;
    }
    _cancelPendingRequests() {
        let count = 0;
        Object.entries(this._rrRequest).forEach(([id, rr]) => {
            rr.rej(`req[${id}] cenceled`);
            delete this._rrRequest[id];
            count += 1;
        });
        console.log(`_cancelPendingRequests(): canceled ${count} req(s)`);

        if (Object.keys(this._rrRequest).length !== 0) {
            throw 'panic: the rr map should have been cleared!';
        }
    }
    terminate() {
        this._cancelPendingRequests();
        this._worker.terminate();
        this._worker = null;
    }
}

const AsyncThreadWorker = { ThreadWorker, Thread };
export default AsyncThreadWorker;
