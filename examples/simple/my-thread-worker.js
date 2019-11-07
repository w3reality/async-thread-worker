importScripts('../../dist/async-thread-worker.min.js');

class MyThreadWorker extends AsyncThreadWorker.ThreadWorker {
    onRequest(id, payload) { // impl
        console.log('[worker] got request:', payload);
        // send a response after 1 second
        setTimeout(() => {
            this.sendResponse(id, payload.toUpperCase());
        }, 1000);
    }
}
const myThreadWorker = new MyThreadWorker(self);
