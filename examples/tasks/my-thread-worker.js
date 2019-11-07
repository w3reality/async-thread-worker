importScripts('../../dist/async-thread-worker.min.js');

class MyThreadWorker extends AsyncThreadWorker.ThreadWorker {
    onRequest(id, payload) {
        const { task, a, b } = payload;
        switch (task) {
            case 'add': this.sendResponse(id, a + b); break;
            case 'sub': this.sendResponse(id, a - b); break;
            case 'mul': this.sendResponse(id, a * b); break;
            case 'div': {
                if (b === 0) {
                    this.sendError(id, 'div by zero');
                } else {
                    this.sendResponse(id, a / b);
                }
                break;
            }
            default: {
                this.sendError(id, 'unknown task');
            }
        }
    }
}
const myThreadWorker = new MyThreadWorker(self);
