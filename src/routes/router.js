import express from 'express'
import { renderIndex, renderLogin, renderWinner } from '../controllers/uiController.js'

const router = express.Router()

router
  .get('/', renderLogin)
  .post('/', renderIndex)
  .get('/index', renderIndex)
  .get('/winner/:winnerName', renderWinner)

export { router as indexRouter }
