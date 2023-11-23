const express = require('express')
const bodyParser = require('body-parser')

const serverFactory = require('./core/SocketServe')

const testRouter = require('./router/test.js')
const rtcRouter = require('./router/rtc.js')
const wxRouter = require('./router/wx.js')

const app = express()

app.use(
  bodyParser.urlencoded({
    extends: true
  })
)

app.use(express.static('static'))

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.use(`/test`, testRouter)
app.use(`/rtc`, rtcRouter)
app.use(`/wx`, wxRouter)

const port = 3000
const hostname = 'localhost'

const [server, io] = serverFactory.factory(app)

// const server = app.listen(port, () => {
//   console.log(`Server running at http://${hostname}:${port}/`)
//   nmsServer.run()
// })

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
