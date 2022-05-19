import fetch from 'node-fetch'
import { getRandom } from './randomDataController.js'
import 'dotenv/config'

export const getAlbums = async (genre) => {
  const key = process.env.KEY
  const url = `http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${genre}&api_key=${key}&format=json`
  const res = await fetch(url)
  const data = await res.json()
  const albums = data.albums.album
  return albums
}

export const getRandomAlbumCover = async (albums) => {
  const randomAlbum = getRandom(albums)
  return randomAlbum
}
