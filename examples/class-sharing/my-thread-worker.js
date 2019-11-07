importScripts('../../dist/async-thread-worker.min.js');

class MyThreadWorker extends AsyncThreadWorker.ThreadWorker {
    onRequest(id, payload) {
        const { task, data } = payload;
        switch (task) {
            case 'import': {
                console.log('data:', data);
                try {
                    importScripts(data);
                    this.sendResponse(id, 'ok');
                } catch (e) {
                    this.sendError(e);
                }
                break;
            }
            case 'test': {
                console.log('Adder:', Adder);
                const { a, b } = data;
                this.sendResponse(id, (new Adder()).add(a, b));
                break;
            }
            default: console.log('unknown task:', task);
        }
    }
}
const myThreadWorker = new MyThreadWorker(self);
