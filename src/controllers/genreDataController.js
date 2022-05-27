import musicGenres from 'music-genres'
import { getRandom } from './randomDataController.js'

export const getGenres = async () => {
  const allGenres = musicGenres.getAllGenres()
  const genres = Object.keys(allGenres)
  return genres
}

export const getRandomGenre = (genres) => {
  let randomGenre = getRandom(genres)
  if (randomGenre === 'Hip_Hop_Rap' || randomGenre === 'R_B_Soul') {
    randomGenre = 'pop'
  }
  return randomGenre
}
