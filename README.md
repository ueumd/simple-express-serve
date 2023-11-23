# Simple node serve
express + socket.io

### ffmpeg

```bash
ffmpeg -re  -stream_loop -1 -i out.mp4 -f flv rtmp://127.0.0.1:5175/live/stream
```

### config/index.js
``` js
module.exports = {
  rtc: {
    key: '',
    secret: '',
    appId: '',
    encryptKey: '',
    token: '',
    streamUrl: '',
    channelName: ''
  },
  wx: {
    appId: '',
    secret: ''
  }
}
```
