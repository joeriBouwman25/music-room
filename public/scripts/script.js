// eslint-disable-next-line no-undef
const socket = io()


const form = document.querySelector('.index form')
const input = document.querySelector('.index form input')
const usersInGame = document.querySelector('.login h2 span')
const ul = document.querySelector('ul')
const user = document.querySelector('p')
const albumDiv = document.querySelector('section div')
const albumCover = document.querySelector('img')

if(user) {
  const userName = user.innerText
  socket.emit('new client', userName)
}

socket.on('new client', (data) => {
  if(usersInGame) {
    usersInGame.innerText = `${data.length}/10`  }
  if(data.length >= 2) {
    socket.emit('new album')
  }
})


let albumName

socket.on('game start', (data) => {
  const simplifiedName = data.name.replace(/ *\([^)]*\) */g, '')
  albumName = simplifiedName.toLowerCase()
  const albumCoverUrl = data.cover['#text']
  albumCover.classList.add('blurry')
  albumCover.src = albumCoverUrl
  console.log(albumName)
})

if(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
  
    socket.emit('chat message', {
      value: input.value,
      user: user.innerText
    })
    input.value = ''
  })
}


socket.on('chat message', (data) => {
  displayMessage(data)
  if(data.value === albumName) {
    const correct = document.getElementsByClassName('blurry')
    correct[0].classList.remove('blurry')
    socket.emit('new album')
  } else {
    albumDiv.classList.add('wrong')
    const removeAnimationClass = () => {
      albumDiv.classList.remove('wrong')
    }
    albumDiv.addEventListener('animationend', removeAnimationClass )
  }
})



const displayMessage = (data) => {
  const li = document.createElement('li')
  li.innerHTML = `
  <span>${data.user}:</span>
  <span>${data.value}</span>
  `
  ul.appendChild(li)

  // scroll to the bottom
  window.scrollTo(0, document.body.scrollHeight)
}
