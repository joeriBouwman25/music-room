/* eslint-disable no-undef */

import { getNewAlbumCover } from './modules/albumCover.js'
import { correctAnswer, wrongAnswer } from './modules/answers.js'
import { fourMistakes, sixMistakes, twoMistakes } from './modules/attempts.js'
import { startGame, pauseGame, gameWinner } from './modules/game.js'
import { displayMessage } from './modules/messages.js'
import { showTotalofUsersInGame, showUserList } from './modules/users.js'

const socket = io()

const loginForm = document.querySelector('.login form')
const playerList = document.querySelector('.index section:nth-of-type(2) ul')

const user = document.querySelector('header > h2')

if (user) {
  const userName = user.innerText
  socket.emit('new client', userName)
}

socket.on('clients', async (data) => {
  if (loginForm) {
    showTotalofUsersInGame(data)
  }
  if (playerList) {
    showUserList(data)
  }
})

socket.on('start game', () => {
  startGame()
})

socket.on('pause game', () => {
  pauseGame()
})

socket.on('new album', (data) => {
  getNewAlbumCover(data)
})

socket.on('chat message', (data) => {
  displayMessage(data)
})

socket.on('correct', (counter) => {
  correctAnswer(counter)
})

socket.on('winner', (winner) => {
  console.log(winner)
  gameWinner(winner)
})

socket.on('wrong', (counter) => {
  wrongAnswer(counter)
})

socket.on('2 mistakes', () => {
  twoMistakes()
})

socket.on('4 mistakes', () => {
  fourMistakes()
})

socket.on('6 mistakes', () => {
  sixMistakes()
})
