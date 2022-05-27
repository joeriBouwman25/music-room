/* eslint-disable no-undef */
const attemptsH2 = document.querySelector('.index > h2')
const guessForm = document.querySelector('.index form')
const winner = document.querySelector('.winner')

export const startGame = () => {
  const h2 = document.querySelector('.index section:first-of-type > h2')
  const loader = document.getElementById('loader')
  h2.classList.add('hide')
  loader.classList.add('hide')
  attemptsH2.classList.remove('hide')
  guessForm.classList.remove('hide')
}

export const pauseGame = () => {
  const h2 = document.querySelector('.index section:first-of-type > h2')
  const loader = document.getElementById('loader')
  if (h2 || loader) {
    h2.classList.remove('hide')
    loader.classList.remove('hide')
    attemptsH2.classList.add('hide')
    guessForm.classList.add('hide')
  }
}

export const gameWinner = (winner) => {
  window.location.pathname = `/winner/${winner}`
}

if (winner) {
  let angle = 0
  setInterval(() => {
    angle += 45
    confetti({
      particleCount: 200,
      spread: 100,
      angle: angle
    })
  }, 500)
}
