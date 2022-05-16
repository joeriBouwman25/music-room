
import musicGenres from 'music-genres'
import fetch from 'node-fetch'


export const getGenres = async () => {
  const allGenres = musicGenres.getAllGenres()
  const genres = Object.keys(allGenres)
  return genres
}

export const getRandomGenre = (genres) => {
  let randomGenre = getRandom(genres)
  if(randomGenre === 'Hip_Hop_Rap' || randomGenre === 'R_B_Soul' ) {
    randomGenre = 'pop'
  } 
  return randomGenre
}

export const getAlbums = async (genre) => {
  const key = 'b1609d18d36793b04ed85505cdd962ba'
  const url = `http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${genre}&api_key=${key}&format=json`
  const res = await fetch(url)
  const data = await res.json()
  const albums = data.albums.album
  return albums
}

export const getRandomAlbumCover = async (albums) => {
  const randomAlbum = getRandom(albums)
  const randomAlbumCover = randomAlbum.image[3]
  return randomAlbumCover
}


const getRandom = (item) => {
  const randomItem = item[Math.floor(Math.random() * item.length)]
  return randomItem
}

// const newStr = randomAlbum.name.replace(/ *\([^)]*\) */g, '')