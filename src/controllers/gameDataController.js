import * as genreController from './genreDataController.js'
import * as albumController from './albumDataController.js'

export const getAlbumToStartGame = async () => {
    const genres = await genreController.getGenres()
    const randomGenre = genreController.getRandomGenre(genres)
    const albums = await albumController.getAlbums(randomGenre)
    const randomAlbum = await albumController.getRandomAlbumCover(albums)
    const album = {
        name: randomAlbum.name,
        cover: randomAlbum.image[3]
    }
    return album
}
