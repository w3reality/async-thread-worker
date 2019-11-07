importScripts('../../dist/async-thread-worker.min.js');
importScripts('./ffmpeg-worker.js');

const _worker = new FfmpegWorker(self, {
    ffmpegScript: './ffmpeg-webm.js',
    outName: 'output.webm',
});
