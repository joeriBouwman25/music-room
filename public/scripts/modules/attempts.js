const albumCover = document.querySelector('img')
const attempts = document.querySelector('.index > h2 span')

export const twoMistakes = () => {
  albumCover.classList.remove('blurry')
  albumCover.classList.add('lessBlurry')
}

export const fourMistakes = () => {
  albumCover.classList.remove('lessBlurry')
  albumCover.classList.add('moreVisible')
}

export const sixMistakes = () => {
  albumCover.classList.remove('moreVisible')
  albumCover.classList.add('blurry')
  attempts.innerText = 6
}
