const NodeMediaServer = require('node-media-server')
const nmsServer = new NodeMediaServer({
  logType: 3, // 调试
  rtmp: {
    port: 5175,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8080,
    allow_origin: '*'
  }
})
module.exports = nmsServer
