import { io } from '../../app.js'
import { getAlbumToStartGame } from './gameDataController.js'

const users = []

export const currentUsers = () => {
  io.emit('clients', users)
}

export const checkNewClient = (userName, socket) => {
  const myProfile = users.forEach(user => user.username.includes(userName))
  if (!myProfile) {
    users.push({
      username: userName,
      score: 0,
      id: socket.id
    })
  }
  if (users.length >= 2) {
    getAlbumToStartGame()
    io.emit('start game')
    io.emit('clients', users)
  } else {
    io.emit('clients', users)
  }
}

export const clientLeft = (socket) => {
  const userLeft = users.filter(user => user.id === socket.id)
  if (userLeft.length !== 0) {
    console.log(userLeft[0].username + ' left')
  }
  const remainingUsers = users.filter(user => user.id !== socket.id)
  return remainingUsers
}
