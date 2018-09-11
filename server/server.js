const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')

const users = new Users()

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.')
    }

    socket.join(params.room)
    // socket.leave(params.room) // Leave the room
    users.removeUser(socket.io)
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))

    // Send to current user
    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app'),
    )

    // Send to everyone except the one sending
    socket.broadcast
      .to(params.room)
      .emit('newMessage', generateMessage('Admin', `${params.name} has joined`))

    callback()
  })

  socket.on('createMessage', (message, callback) => {
    // console.log('createMessage', message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback() // Creates the 3rd argument (acknowledgement) in emit('createMessage')
  })

  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('User', coords.latitude, coords.longitude),
    )
  })

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left`),
      )
    }
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
