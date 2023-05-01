import dotenv from 'dotenv'
// Load environment variables BEFORE setting up config
dotenv.config()

import devConfig from './dev.js'
import prodConfig from './prod.js'

const env = process.env.NODE_ENV || 'development'
const envConfig = env === 'development' ? devConfig : prodConfig

const baseConfig = {
  cookieSecret: process.env.COOKIE_SECRET,
  env,
  db: {
    url: process.env.MONGO_URI,
  },
  pageSize: parseInt(process.env.PAGE_SIZE) || 10,
  port: parseInt(process.env.PORT) || 8080,
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 12,
  jwtAccessTokenExpiresIn: '1d',
  jwtAccessTokenSecret: process.env.JWT_SECRET,
  // Days to milliseconds
  jwtCookieExpires: process.env.JWT_EXPIRES || '1h',
  log: {
    level: 'debug',
  },
  mail: {
    connection: process.env.MAIL_CONNECTION || 'smtp',
    from: process.env.MAIL_FROM,
    smtp: {
      driver: 'smtp',
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    },
  },
}

const config = { ...baseConfig, ...envConfig }

export default config
