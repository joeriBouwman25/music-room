
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
const io = new Server(server)

let users =[]

io.on('connection', (socket) => {
    socket.on('new client', async (userName) => {
      const myProfile = users.find((profile) => profile.username.includes(userName))
      if(!myProfile)
        users.push({
          username: userName,
          score: 0,
          id: socket.id
      })

    // if (users.length >= 2) {
    //   const album = await getAlbumToStartGame()
    //   io.emit('game start', album)
    //   io.emit('new client', (users))

    // } else {
    //     io.emit('new client', (users))
    // }
      io.emit('new client', (users))
    })
   
    socket.on('new album', async () => {
      const album = await getAlbumToStartGame()
      io.emit('game start', album)
    })
  
    socket.on('chat message', (data) => {
      io.emit('chat message', data)
    })
  
    socket.on('disconnecting', (user) => {

      // users = removeUser('joeri', socket)
      // io.emit('new user', (users))
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
