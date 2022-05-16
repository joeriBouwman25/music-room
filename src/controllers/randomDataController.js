
export const getRandom = (item) => {
  const randomItem = item[Math.floor(Math.random() * item.length)]
  return randomItem
}

// const newStr = randomAlbum.name.replace(/ *\([^)]*\) */g, '')