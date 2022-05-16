import { socketConnection } from './socketServer.js'
import {  getGenres, getRandomGenre, getRandomAlbumCover, getAlbums } from './dataController.js'


export const renderLogin = (req, res) => {
  res.render('login')
}

export const renderIndex = async (req, res) => {
  const genres = await getGenres()
  const randomGenre = getRandomGenre(genres)
  const albums = await getAlbums(randomGenre)
  const randomAlbumCover = await getRandomAlbumCover(albums)
  res.render('index', {
    cover: randomAlbumCover['#text']
  })
  const userName = req.body.userName
  socketConnection(userName)
}

