
// eslint-disable-next-line no-undef
const socket = io()

const loginForm = document.querySelector('.login form')
const loginInput = document.querySelector('.login form input')
const guessForm = document.querySelector('.index form')
const guessInput = document.querySelector('.index form input')
const usersInGame = document.querySelector('.login h2 span')
const ul = document.querySelector('.index section:nth-of-type(2) ul')
const user = document.querySelector('header > h2')
const albumDiv = document.querySelector('section div')
const albumCover = document.querySelector('img')
const timer = document.querySelector('.index section:first-of-type h2 span')
const playerList = document.querySelector('.index section:nth-of-type(3) ul')

if (user) {
  const userName = user.innerText
  socket.emit('new client', userName)
}

socket.on('clients', async (data) => {
  if (loginForm) {
    usersInGame.innerText = `${data.length}/10`
    loginForm.addEventListener('submit', (e) => {
      data.forEach(user => {
        if (user.username === loginInput.value) {
          e.preventDefault()
        } else if (data.length === 10) {
          e.preventDefault()
        }
      })
    })
  }
  if (playerList) {
    const li = document.querySelectorAll('section:nth-of-type(3) li')
    li.forEach(item => item.remove())
    data.forEach(user => {
      const playerLi = document.createElement('li')
      const playerName = document.createTextNode(user.username)
      playerLi.appendChild(playerName)
      playerList.appendChild(playerLi)
    })
  }
})

const albumInfo = {
  name: '',
  artist: ''
}

socket.on('new album', (data) => {
  const albumCoverUrl = data.cover['#text']
  const simplifiedName = data.name.replace(/ *\([^)]*\) */g, '')
  albumInfo.name = simplifiedName.toLowerCase()
  albumInfo.artist = data.artist.toLowerCase()
  albumCover.src = albumCoverUrl
  albumCover.classList.add('blurry')

  console.log(albumInfo)
})

socket.on('game start', () => {
  socket.emit('game start')
})

socket.on('timer', (timeLeft) => {
  timer.innerText = timeLeft
})

socket.on('20 seconds', () => {
  albumCover.classList.remove('blurry')
  albumCover.classList.add('lessBlurry')
})

socket.on('10 seconds', () => {
  albumCover.classList.remove('lessBlurry')
  albumCover.classList.add('moreVisible')
})

socket.on('time over', (data) => {
  albumCover.classList.remove('moreVisible')
  albumCover.classList.add('blurry')
})

if (guessForm) {
  guessForm.addEventListener('submit', (e) => {
    socket.emit('chat message', {
      value: guessInput.value,
      user: user.innerText,
      album: albumInfo
    })
    e.preventDefault()
    guessInput.value = ''
  })
}

socket.on('chat message', (data) => {
  displayMessage(data)
})

socket.on('correct', () => {
  // eslint-disable-next-line no-undef
  confetti()
})

socket.on('wrong', () => {
  albumDiv.classList.add('wrong')
  const removeAnimationClass = () => {
    albumDiv.classList.remove('wrong')
  }
  albumDiv.addEventListener('animationend', removeAnimationClass)
})

const displayMessage = (data) => {
  const li = document.createElement('li')
  li.innerHTML = `
  <span>${data.user}:</span>
  <span>${data.value}</span>
  `
  if (user.innerText === data.user) {
    li.className = 'outgoing'
  } else {
    li.className = 'incoming'
  }
  ul.appendChild(li)

  // scroll to the bottom
  ul.scrollTo(0, document.body.scrollHeight)
}
