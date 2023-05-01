import mongoose from 'mongoose'

import logger from './utils/logger.js'
import App from './app.js'

const startServer = async (cnf) => {
  logger.info('Connecting DB')
  await mongoose.connect(cnf.db.url)
  logger.info('DB connected')
  const app = new App(cnf)
  app.initialize()
  logger.info('Starting server')
  await app.start()
}

export default startServer
