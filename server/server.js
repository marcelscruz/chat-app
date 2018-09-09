const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const { generateMessage, generateLocationMessage } = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('New user connected')

  // Send to current user
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

  // Send to everyone except the one sending
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined'),
  )

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback('This is from the server')
  })

  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude),
    )
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected')
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
