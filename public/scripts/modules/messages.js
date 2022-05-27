import { albumInfo } from './albumCover.js'

const ul = document.querySelector('.index section:first-of-type ul')
const user = document.querySelector('header > h2')
const guessForm = document.querySelector('.index form')
const guessInput = document.querySelector('.index form input')
// eslint-disable-next-line no-undef
const socket = io()

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

export const displayMessage = (data) => {
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
