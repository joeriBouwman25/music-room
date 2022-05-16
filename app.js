
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { engine } from 'express-handlebars'
import cors from 'cors'

import 'dotenv/config'
import compression from 'compression'
import session from 'express-session'

import { indexRouter } from './src/routes/router.js'

const app = express()
const port = process.env.PORT || 8000
const server = createServer(app)
export const io = new Server(server)
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
