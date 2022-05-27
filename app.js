
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
import { checkNewClient, clientLeft, currentUsers } from './src/controllers/userController.js'
import { addScoreToUser, checkGivenAnswer } from './src/controllers/scoreDataController.js'

// import { newUser, removeUser } from './public/scripts/modules/users.js'

const app = express()
const port = process.env.PORT || 8000
const server = createServer(app)
export const io = new Server(server)

io.on('connection', (socket) => {
  currentUsers()

  socket.on('new client', (userName) => {
    checkNewClient(userName, socket)
  })

  socket.on('chat message', (data) => {
    const answer = checkGivenAnswer(data)
    updateScore(answer)
    io.emit('chat message', data)
  })

  socket.on('disconnect', () => {
    users = clientLeft(users, socket)
    io.emit('clients', users)
    if (users.length <= 1) {
      io.emit('pause game')
    }
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
