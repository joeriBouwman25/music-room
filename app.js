
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { engine } from 'express-handlebars'
import cors from 'cors'

import 'dotenv/config'
import compression from 'compression'
import session from 'express-session'

import { indexRouter } from './src/routes/router.js'
import { getAlbumToStartGame } from './src/controllers/gameDataController.js'

// import { newUser, removeUser } from './public/scripts/modules/users.js'

const app = express()
const port = process.env.PORT || 8000
const server = createServer(app)
export const io = new Server(server)

const users = []

io.on('connection', (socket) => {
  io.emit('clients', users)
  socket.on('new client', (userName) => {
    const myProfile = users.forEach(user => user.username.includes(userName))
    if (!myProfile) {
      users.push({
        username: userName,
        score: 0,
        id: socket.id
      })
    }
    if (users.length >= 2) {
      getAlbumToStartGame()
      io.emit('new client', (users))
      io.emit('clients', users)
    } else {
      io.emit('new client', (users))
      io.emit('clients', users)
    }
  })

  socket.on('chat message', (data) => {
    console.log(data.album.name)
    io.emit('chat message', data)
    if (data.value === data.album.name || data.value === data.album.artist) {
      io.emit('correct')
      getAlbumToStartGame()
    } else {
      io.emit('wrong')
    }
  })

  socket.on('disconnect', () => {
    console.log(socket.id)
    const userLeft = users.filter(user => user.id === socket.id)
    if (userLeft.length !== 0) {
      console.log(userLeft[0].username + ' left')
    }
    const remainingUsers = users.filter(user => user.id !== socket.id)
    io.emit('clients', remainingUsers)
  })
})

app
  .engine('.hbs', engine({ extname: '.hbs' }))
  .set('view engine', '.hbs')
  .set('views', 'views')

  .use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
  }))

  .use(cors())
  .use(compression())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static('public'))
  .use(indexRouter)

server.listen(port, () =>
  console.log(`Server launched on port ${port} 🚀`)
)
