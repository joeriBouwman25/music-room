export const checkGivenAnswer = (data, users) => {
  if (data.value === data.album.name || data.value === data.album.artist) {
    return true
  } else {
    return false
  }
}
