### FFmpeg builds for the WASM target

We've created a [fork](https://github.com/w3reality/wasm-ffmpeg.js) of [PaulKinlan/ffmpeg.js](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (a WASM port of [Kagami/ffmpeg.js](https://github.com/Kagami/ffmpeg.js)), and then built (see [instructions](https://github.com/w3reality/wasm-ffmpeg.js/wiki))

- `ffmpeg-webm.{wasm,js}`
- `ffmpeg-mp4.{wasm,js}`

that are included in this directory.  As such, the use of these four files should be based on
[their own license terms](https://github.com/w3reality/wasm-ffmpeg.js#license).

### Credits

Thanks [PaulKinlan](https://github.com/PaulKinlan), [Kagami](https://github.com/Kagami) and the FFmpeg developers for making this application possible.

### Demo

[![screenshot](./encoder-trim.png)](https://w3reality.github.io/async-thread-worker/examples/wasm-ffmpeg/index.html)
