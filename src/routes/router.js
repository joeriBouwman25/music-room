import express from 'express'
import { renderIndex, renderLogin } from '../controllers/uiController.js'

const router = express.Router()

router
  .get('/', renderLogin)
  .post('/', renderIndex)
  .get('/index', renderIndex)

export { router as indexRouter }
