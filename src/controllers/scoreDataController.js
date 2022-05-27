import { io } from '../../app.js'
import { getAlbumToStartGame } from './gameDataController.js'
import { currentUsers } from './userController.js'

let counter = 6

export const updateScore = (answer, data) => {
  if (answer === true) {
    const users = currentUsers()
    const correctUser = users.find(user => user.username.includes(data.user))
    correctUser.score += 10
    counter = 6
    io.emit('correct', counter)
    io.emit('clients', users)
    getAlbumToStartGame()
  } else {
    counter--
    io.emit('wrong', counter)
  }
}

const correctUser = addScoreToUser(data, users)
if (correctUser.score === 60) {
  io.emit('winner', correctUser)
}
if (counter === 4) {
  io.emit('2 mistakes')
} else if (counter === 2) {
  io.emit('4 mistakes')
} else if (counter === 0) {
  io.emit('6 mistakes')
  counter = 6
  getAlbumToStartGame()
}
