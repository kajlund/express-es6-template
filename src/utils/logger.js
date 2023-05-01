import pino from 'pino'
import pinoHttp from 'pino-http'

import cnf from '../config/index.js'

const logger = pino(cnf.log)

export default logger
export const httpLogger = pinoHttp({ logger })
