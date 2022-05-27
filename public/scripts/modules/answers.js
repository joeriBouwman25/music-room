/* eslint-disable no-undef */
const guessForm = document.querySelector('.index form')
const albumDiv = document.querySelector('.index section div:nth-of-type(2)')
const attempts = document.querySelector('.index > h2 span')

export const correctAnswer = (counter) => {
  if (guessForm) {
    confetti()
    attempts.innerText = counter
  }
}

export const wrongAnswer = (counter) => {
  attempts.innerText = counter
  albumDiv.classList.add('wrong')
  const removeAnimationClass = () => {
    albumDiv.classList.remove('wrong')
  }
  albumDiv.addEventListener('animationend', removeAnimationClass)
}
