importScripts('../../dist/async-thread-worker.min.js');
importScripts('./ffmpeg-worker.js');

const _worker = new FfmpegWorker(self, {
    ffmpegScript: './ffmpeg-mp4.js',
    outName: 'output.mp4',
});
