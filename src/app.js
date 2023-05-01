import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import * as swaggerUI from 'swagger-ui-express'
import xss from 'xss-clean'

import logger from './utils/logger.js'
import router from './router.js'
import swaggerDoc from '../swagger.json' assert { type: 'json' }

// const whitelist = ['http://localhost:5173']
// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     logger.info(origin)
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error())
//     }
//   },
// }

class App {
  constructor(cnf) {
    this.cnf = cnf
    this.port = cnf.port
    this.app = express()
    this._setupMiddleware()
    this.router = router
  }

  _listen() {
    this.app.listen(this.port, () => {
      logger.info(`Webserver listening on port ${this.port}`)
    })
  }

  _setupMiddleware() {
    // security middleware
    this.app.use(helmet())
    this.app.use(xss())
    this.app.use(cors())
    this.app.use(mongoSanitize())

    this.app.use(cookieParser(this.cnf.cookieSecret))
    this.app.use(express.json({ limit: '10kb' }))
    this.app.use(express.urlencoded({ extended: true }))

    // rate limiter
    const limiter = rateLimit({
      max: 1000,
      windowMs: 60 * 60 * 1000,
      message: 'Too many requests from this client',
    })
    this.app.use(limiter)

    this.app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
  }

  _setupRoutes() {
    this.app.get('/ping', (req, res) => res.send('PONG'))
    this.router.initializeRouter(this.app)
  }

  _setViewEngine() {}

  async initialize() {
    this._setupMiddleware()
    this._setViewEngine()
    this._setupRoutes()
  }

  async start() {
    try {
      this._listen()
    } catch (err) {
      logger.error(err)
    }
  }
}

export default App
