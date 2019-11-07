importScripts('../../dist/async-thread-worker.min.js');

class MyThreadWorker extends AsyncThreadWorker.ThreadWorker {
    onRequest(id, payload) {
        const { task, data } = payload;
        switch (task) {
            case 'draw': this.draw(id, data); break;
            default: console.log('unknown task:', task);
        }
    }
    draw(id, buf) {
        console.log('buf:', buf);

        const view = new Uint8ClampedArray(buf);
        for (let i = 0; i < view.length/4; i++) {
            view[4*i] = 0;
            view[4*i+1] = Math.random() * 255;
            view[4*i+2] = 0;
            view[4*i+3] = 255;
        }

        this.sendResponse(id, buf, [buf]); // [transferables]
    }
}
const myThreadWorker = new MyThreadWorker(self);
