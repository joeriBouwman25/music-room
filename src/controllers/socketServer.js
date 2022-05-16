import { io } from '../../app.js'
import { newUser, removeUser } from '../../public/scripts/users.js'

export const socketConnection = (user) => {
  
  io.on('connection', (socket) => {
    let users = newUser(user, socket)
    io.emit('new user', (users))

    socket.on('chat message', (data) => {
      socket.emit('chat message', data)
    })

    socket.on('disconnecting', () => {
      users = removeUser(user, socket)
      io.emit('new user', (users))
    })
  })
}