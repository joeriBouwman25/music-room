import { socketConnection } from './socketServer.js'
// import { getGenres } from './dataController.js'
import LastFM from 'last-fm'

export const renderLogin = (req, res) => {
  res.render('login')
}

export const renderIndex = async (req, res) => {
  const lastfm = new LastFM('b1609d18d36793b04ed85505cdd962ba')
  // const genres = await getGenres()
  lastfm.tagTopAlbums({ tag: 'alternative' }, (err, data) => {
    if (!err) {
      const albums = data.album
      const randomAlbum = albums[Math.floor(Math.random() * albums.length)]
      const albumImg = randomAlbum.image[3]
      const newStr = randomAlbum.name.replace(/ *\([^)]*\) */g, '')
      res.render('index', {
        newStr,
        randomAlbum,
        albumCover: albumImg['#text']
      })
    } else {
      console.log(err)
    }
  })
  const userName = req.body.userName
  socketConnection(userName)
}

// c42c273e38166c7fda19bd5397954277
// 5e56c33741bf6ecf3c5001fdba499132
