const loginForm = document.querySelector('.login form')
const loginInput = document.querySelector('.login form input')
const usersInGame = document.querySelector('.login h2 span')
const h3 = document.querySelector('.login h3')
const playerList = document.querySelector('.index section:nth-of-type(2) ul')

export const showTotalofUsersInGame = (data) => {
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

export const showUserList = (data) => {
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
