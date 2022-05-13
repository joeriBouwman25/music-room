import { io } from '../../app.js'
import { newUser, removeUser } from '../../public/scripts/users.js'

export const socketConnection = (user) => {
  io.on('connection', (socket) => {
    newUser(user, socket.id)

    socket.on('chat message', (data) => {
      socket.emit('chat message', data)
    })

    socket.on('disconnecting', () => {
      removeUser(user)
    })
  })
}
