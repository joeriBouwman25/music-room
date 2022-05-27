import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { engine } from 'express-handlebars'
import cors from 'cors'

import 'dotenv/config'
import compression from 'compression'
import session from 'express-session'

import { indexRouter } from './src/routes/router.js'
import { checkCurrentUsers, checkNewClient, userLeft } from './src/controllers/userController.js'
import { checkAnswer } from './src/controllers/messageDataController.js'

// import { newUser, removeUser } from './public/scripts/modules/users.js'

const app = express()
const port = process.env.PORT || 8000
const server = createServer(app)
export const io = new Server(server)

let users = []

io.on('connection', (socket) => {
  io.emit('clients', users)

  socket.on('new client', (userName) => {
    users = checkNewClient(users, userName, socket)
    checkCurrentUsers(users)
  })

  socket.on('chat message', (data) => {
    io.emit('chat message', data)
    const answer = checkAnswer(data, users)
    io.emit(answer.answer, answer.counter)
    io.emit('clients', users)
  })

  socket.on('disconnect', () => {
    users = userLeft(users, socket)
    checkCurrentUsers(users)
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
