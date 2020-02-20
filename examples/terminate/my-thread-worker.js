importScripts('../../dist/async-thread-worker.min.js');

class MyThreadWorker extends AsyncThreadWorker.ThreadWorker {
    onRequest(id, payload) {
        const { task, sec } = payload;
        switch (task) {
            case 'run': this.run(id, sec); break;
            default: console.log('unknown task:', task);
        }
    }
    run(id, sec) {
        const timeStart = performance.now()/1000;
        console.log('run(): timeStart:', timeStart);

        // busy looping for `sec` seconds
        while (1) {
            if (performance.now()/1000 - timeStart > sec) break;
        }

        const timeEnd = performance.now()/1000;
        console.log('run(): timeEnd:', timeEnd);
        this.sendResponse(id, `task[${id}] done`);
    }
}
const myThreadWorker = new MyThreadWorker(self);
