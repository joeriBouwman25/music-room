
// eslint-disable-next-line no-undef
const socket = io()

const loginForm = document.querySelector('.login form')
const loginInput = document.querySelector('.login form input')
const guessForm = document.querySelector('.index form')
const guessInput = document.querySelector('.index form input')
const usersInGame = document.querySelector('.login h2 span')
const ul = document.querySelector('.index section:first-of-type ul')
const user = document.querySelector('header > h2')
const albumDiv = document.querySelector('.index section div:nth-of-type(2)')
const attemptsH2 = document.querySelector('.index > h2')
const attempts = document.querySelector('.index > h2 span')
const playerList = document.querySelector('.index section:nth-of-type(2) ul')
const h3 = document.querySelector('.login h3')

if (user) {
  const userName = user.innerText
  socket.emit('new client', userName)
}

socket.on('clients', async (data) => {
  if (loginForm) {
    usersInGame.innerText = data.length
    loginForm.addEventListener('submit', (e) => {
      data.forEach(user => {
        if (user.username === loginInput.value) {
          loginForm.classList.add('wrong')
          h3.classList.add('show')
          e.preventDefault()
        } else if (data.length === 10) {
          e.preventDefault()
        }
      })
    })
  }
  if (playerList) {
    const li = document.querySelectorAll('section:nth-of-type(2) li')
    li.forEach(item => item.remove())
    data.forEach(user => {
      const playerLi = document.createElement('li')
      const scoreSpan = document.createElement('span')
      const score = document.createTextNode(user.score)
      scoreSpan.appendChild(score)
      const playerName = document.createTextNode(user.username + ': ')
      playerLi.appendChild(playerName)
      playerLi.insertAdjacentElement('beforeend', scoreSpan)
      playerList.appendChild(playerLi)
    })
  }
})

const albumInfo = {
  name: '',
  artist: ''
}

socket.on('start game', () => {
  const h2 = document.querySelector('.index section:first-of-type > h2')
  const loader = document.getElementById('loader')
  h2.classList.add('hide')
  loader.classList.add('hide')
  attemptsH2.classList.remove('hide')
  guessForm.classList.remove('hide')
})

socket.on('pause game', () => {
  const h2 = document.querySelector('.index section:first-of-type > h2')
  const loader = document.getElementById('loader')
  h2.classList.remove('hide')
  loader.classList.remove('hide')
  attemptsH2.classList.add('hide')
  guessForm.classList.add('hide')
})

socket.on('new album', (data) => {
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
  albumDiv.appendChild(albumElement)
  console.log(albumInfo)
})

socket.on('2 mistakes', () => {
  const albumCover = document.querySelector('img')
  albumCover.classList.remove('blurry')
  albumCover.classList.add('lessBlurry')
})

socket.on('4 mistakes', () => {
  const albumCover = document.querySelector('img')
  albumCover.classList.remove('lessBlurry')
  albumCover.classList.add('moreVisible')
})

socket.on('6 mistakes', (counter) => {
  const albumCover = document.querySelector('img')
  albumCover.classList.remove('moreVisible')
  albumCover.classList.add('blurry')
  attempts.innerText = 6
})

if (guessForm) {
  guessForm.addEventListener('submit', (e) => {
    socket.emit('chat message', {
      value: guessInput.value.toLowerCase(),
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

socket.on('correct', (counter) => {
  if (guessForm) {
    // eslint-disable-next-line no-undef
    confetti()
    attempts.innerText = counter
  }
})

socket.on('wrong', (counter) => {
  attempts.innerText = counter
  albumDiv.classList.add('wrong')
  const removeAnimationClass = () => {
    albumDiv.classList.remove('wrong')
  }
  albumDiv.addEventListener('animationend', removeAnimationClass)
})

const displayMessage = (data) => {
  const li = document.createElement('li')
  li.innerHTML = `
  <p><span>${data.user}:</span></p>
  <p>${data.value}</p>
  `
  if (user.innerText === data.user) {
    li.className = 'outgoing'
  } else {
    li.className = 'incoming'
  }
  ul.appendChild(li)

  // scroll to the bottom
  ul.scrollTo(0, document.body.scrollHeight + 3)
}
