
// eslint-disable-next-line no-undef
const socket = io('/')

const form = document.querySelector('.index form')
const input = document.querySelector('.index form input')
const ul = document.querySelector('ul')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  socket.emit('chat message', {
    value: input.value
  })
  input.value = ''
})

socket.on('chat message', (data) => {
  displayMessage(data.value)
})

const displayMessage = (data) => {
  const li = document.createElement('li')
  const text = document.createTextNode(data)
  li.appendChild(text)
  ul.appendChild(li)

  // scroll to the bottom
  window.scrollTo(0, document.body.scrollHeight)
}
