
class FfmpegWorker extends AsyncThreadWorker.ThreadWorker {
    // override
    onCreate(opts) {
        super.onCreate();

        const { ffmpegScript, outName } = opts;
        importScripts(ffmpegScript); // for `ffmpegjs`
        this.nameOut = outName;
    }

    // impl
    onRequest(id, payload) {
        switch (payload.task) {
            case 'version':
            case 'help': this.runVersionOrHelp(id, payload); break;
            case 'encode': this.runEncode(id, payload); break;
            default: {
                this.sendError(id, 'unknown task');
            }
        }
    }

    async runVersionOrHelp(id, payload) {
        try {
            const ret = await FfmpegWorker.runFfmpeg({
                mode: `mode-${payload.task}`,
            });
            this.sendResponse(id, ret);
        } catch (err) {
            this.sendError(id, err);
        }
    }

    async runEncode(id, payload) {
        const { nameIn, bufIn } = payload;
        console.log('bufIn.byteLength:', bufIn.byteLength);
        try {
            const ret = await FfmpegWorker.runFfmpeg({
                mode: 'mode-encode',
                nameIn: nameIn,
                nameOut: this.nameOut,
                bufIn: bufIn,
            });
            this.sendResponse(id, ret, [ret.buf]); // [transferrable]
        } catch (err) {
            this.sendError(id, err);
        }
    }

    static runFfmpeg(params) {
        return new Promise((res, rej) => {
            switch (params.mode) {
                case 'mode-version':
                case 'mode-help': {
                    this._runFfmpeg([`${params.mode.replace('mode','')}`], [],
                        data => res({
                            sec: data.sec,
                            stdout: data.stdout,
                        }), rej);
                    break;
                }
                case 'mode-encode': {
                    const onFilesReady = data => {
                        const { ev, sec, stdout, stderr } = data;
                        if (ev.MEMFS.length === 0) {
                            rej('runFfmpeg(): no output available');
                        } else {
                            const { name, data } = ev.MEMFS[0]; // filled `data` is a Uint8Array
                            console.log('name:', name); // filled as `nameOut`
                            res({
                                buf: data.buffer,
                                sec: sec,
                                stdout: stdout,
                                stderr: stderr,
                            });
                        }
                    };

                    this._runFfmpeg(
                        ['-y', '-i', params.nameIn, params.nameOut],
                        [{name: params.nameIn, data: params.bufIn}],
                        onFilesReady, rej);
                    break;
                }
                default: {
                    rej('unknown mode');
                }
            }
        });
    }

    static _runFfmpeg(args, memfs, onFilesReady=null, onError=null) {
        const timeStart = performance.now();
        console.log('timeStart:', timeStart);

        let stdout = '', stderr = '';
        try {
            const _ret = ffmpegjs({
                arguments: args,
                MEMFS: memfs,
                stdin: () => {},
                onfilesready: ev => {
                    console.log('onfilesready: ev:', ev);

                    const timeEnd = performance.now();
                    console.log('timeEnd:', timeEnd);
                    const sec = (timeEnd - timeStart) / 1000;
                    console.log('took (s):', sec);

                    if (onFilesReady) onFilesReady(
                        { ev, sec, stdout, stderr });
                },
                print: data => {
                    // console.log('stdout:', data);
                    stdout += data + "\n";
                },
                printErr: data => {
                    // console.log('stderr:', data);
                    stderr += data + "\n";
                },
                postRun: result => console.log('postRun(): result:', result),
                onExit: code => {
                    console.log("onExit(): Process exited with code " + code);
                    console.log('onExit(): stdout:', stdout);
                },
            });
            console.log('_ret:', _ret);
        } catch (err) {
            if (onError) onError(err);
        }
    }
}

self.FfmpegWorker = FfmpegWorker;
