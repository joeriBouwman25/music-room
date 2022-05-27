import { io } from '../../app.js'
import { getAlbumToStartGame } from './gameDataController.js'

export const checkNewClient = (users, userName, socket) => {
  const myProfile = users.forEach(user => user.username.includes(userName))
  if (!myProfile) {
    users.push({
      username: userName,
      score: 0,
      id: socket.id
    })
  }
  return users
}

export const checkCurrentUsers = (users) => {
  if (users.length >= 2) {
    getAlbumToStartGame()
    io.emit('start game')
  } else if (users.length <= 1) {
    io.emit('pause game')
  }
  io.emit('clients', users)
}

export const userLeft = (users, socket) => {
  const userLeft = users.filter(user => user.id === socket.id)
  if (userLeft.length !== 0) {
    console.log(userLeft[0].username + ' left')
  }
  const remainingUsers = users.filter(user => user.id !== socket.id)
  return remainingUsers
}
