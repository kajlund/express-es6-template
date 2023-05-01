import util from 'util'

import cnf from './config/index.js'
import startServer from './server.js'
import logger from './utils/logger.js'

process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION - ${err.stack || err}`)
  throw err
})

process.on('unhandledRejection', (reason, p) => {
  logger.error(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)} reason: ${reason}`)
})

startServer(cnf)
  .then(() => logger.info('Server started OK'))
  .catch((err) => logger.error(err))
