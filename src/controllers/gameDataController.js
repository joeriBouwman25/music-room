import * as genreController from './genreDataController.js'
import * as albumController from './albumDataController.js'

export const getAlbumToStartGame = async () => {
    const genres = await genreController.getGenres()
    const randomGenre = genreController.getRandomGenre(genres)
    const albums = await albumController.getAlbums(randomGenre)
    const randomAlbumCover = await albumController.getRandomAlbumCover(albums)
    return randomAlbumCover
}
