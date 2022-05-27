import { getAlbumToStartGame, mistakeCount } from './gameDataController.js'

let counter = 6

export const checkAnswer = (data, users) => {
  if (data.value === data.album.name || data.value === data.album.artist) {
    const correctUser = users.find(user => user.username.includes(data.user))
    correctUser.score += 10
    if (correctUser.score === 60) {
      return { answer: 'winner', counter: correctUser.username }
    } else {
      const counter = updateAttempts(true)
      getAlbumToStartGame()
      return { answer: 'correct', counter: counter }
    }
  } else {
    updateAttempts(false)
    mistakeCount(counter)
    if (counter === 0) {
      counter = 6
    }
    return { answer: 'wrong', counter: counter }
  }
}

export const updateAttempts = (boolean) => {
  if (boolean === true) {
    counter = 6
    return counter
  } else {
    counter--
    return counter
  }
}
