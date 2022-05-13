
import musicGenres from 'music-genres'
// import LastFM from 'last-fm'

export const getGenres = async () => {
  const allGenres = musicGenres.getAllGenres()
  const genres = Object.keys(allGenres)
  return genres
}
