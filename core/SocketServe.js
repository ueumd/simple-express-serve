const createServer = require('http').createServer
const socketIO = require('socket.io')
const SocketIOServer = socketIO.Server

const emitTo = ({ id, event, message }) => {
  const targetSocket = io.sockets.sockets.get(id)
  if (targetSocket) {
    targetSocket.emit(event, message)
  } else {
    io.close()
  }
}

module.exports = {
  factory: function (app) {
    const server = createServer(app)
    io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
      }
    })

    io.on('connection1', (socket) => {
      console.log('[socket connection success id]:', socket.id)
      emitTo({
        id: socket.id,
        event: 'session/server',
        message: 'Socket connection successful, id: ' + socket.id
      })
    })

    io.on('connection', (socket) => {
      socket.on('disconnecting', (reason) => {
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            console.log('socketId: ', socket.id)
            socket.to(room).emit('user has left', socket.id)
          }
        }
      })

      //接收到消息时触发
      socket.on('message', function (data) {
        console.log('服务端收到 : ', data)
        socket.send('你好客户端, ' + data)
      })

      //房间内的广播
      socket.on('room_broadcast', function (data) {
        console.log(1, data)
      })
    })

    /**
     * socket 房间
     * https://www.cnblogs.com/jkko123/p/10285608.html
     */
    io.of('/user').on('connection', (socket) => {
      let rooms = []

      //加入房间
      socket.on('join', function (name) {
        socket.join(name, function () {
          if (!rooms.includes(name)) {
            rooms.unshift(name)
          }
          console.log(`${socket.id} 加入房间 ${name}`)
          console.log(rooms)
        })
      })

      //离开房间
      socket.on('leave', function (name) {
        socket.leave(name, function () {
          rooms = rooms.filter(function (value) {
            return value !== name
          })
          console.log(`${socket.id} 离开房间 ${name}`)
          console.log(rooms)
        })
      })

      //房间内的广播
      socket.on('room_broadcast', function (data) {
        //socket.to(rooms[0]).send('房间 ${rooms[0]} 内的广播 : ' + data); 房间下的所有客户端，不包括发送者
        //io.of(命名空间).in(rooms[0]).send(`房间 ${rooms[0]} 内的广播 : ${data}`); 房间下的所有客户端，包括发送者
        io.of('/user').in(rooms[0]).send(`房间 ${rooms[0]} 内的广播 : ${data}`)
      })

      //命名空间下的广播
      socket.on('namespace_broadcast', function (data) {
        //socket.broadcast.send('命名空间下的广播 : ' + data); 命名空间下所有客户端，不包括发送者
        //io.of(命名空间).send('命名空间下的广播 : ' + data); 命名空间下所有客户端，包括发送者
        io.of('/user').send('命名空间下的广播 : ' + data)
      })
    })

    io.return[(server, io)]
  }
}
