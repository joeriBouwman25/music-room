
const albumDiv = document.querySelector('.index section div:nth-of-type(2)')

export const albumInfo = {
  name: '',
  artist: ''
}

export const getNewAlbumCover = (data) => {
  const albumCover = document.querySelector('img')
  if (albumCover) {
    albumCover.remove()
  }
  const albumElement = document.createElement('img')
  const albumCoverUrl = data.cover['#text']
  const simplifiedName = data.name.replace(/ *\([^)]*\) */g, '')
  albumInfo.name = simplifiedName.toLowerCase()
  albumInfo.artist = data.artist.toLowerCase()
  albumElement.src = albumCoverUrl
  albumElement.classList.add('blurry')
  if (albumDiv) {
    albumDiv.appendChild(albumElement)
    console.log(albumInfo)
  }
}
