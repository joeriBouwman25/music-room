import * as genreController from './genreDataController.js'
import * as albumController from './albumDataController.js'
import { io } from '../../app.js'

export const getAlbumToStartGame = async () => {
  const genres = await genreController.getGenres()
  const randomGenre = genreController.getRandomGenre(genres)
  const albums = await albumController.getAlbums(randomGenre)
  const randomAlbum = await albumController.getRandomAlbumCover(albums)
  const album = {
    name: randomAlbum.name,
    artist: randomAlbum.artist.name,
    cover: randomAlbum.image[3]
  }
  io.emit('new album', album)
}

export const mistakeCount = (counter) => {
  if (counter === 4) {
    io.emit('2 mistakes')
  } else if (counter === 2) {
    io.emit('4 mistakes')
  } else if (counter === 0) {
    io.emit('6 mistakes')
    getAlbumToStartGame()
  }
}

// let timeLeft = 30

// export const startTimerForGame = async () => {
//   timeLeft -= 1
//   io.emit('timer', timeLeft)
//   if (timeLeft === 20) {
//     io.emit('20seconds')
//   } else if (timeLeft === 10) {
//     io.emit('10 seconds')
//   } else if (timeLeft < 1) {
//     // io.emit('time over', album)
//     await getAlbumToStartGame()
//     stopTimer()
//   }
// }

// let countdown

// export const startTimer = () => {
//   countdown = setInterval(startTimerForGame, 1000)
// }

// export const stopTimer = () => {
//   clearInterval(countdown)
//   startTimer()
// }
