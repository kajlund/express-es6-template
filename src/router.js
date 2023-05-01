import express from 'express'

import cnf from './config/index.js'
import JsonResponse from './utils/responses.js'
import logger from './utils/logger.js'
import { AppError } from './utils/errors.js'
import { reasonPhrases, statusCodes } from './utils/statuscodes.js'

// Import Route Objects

class Router {
  constructor() {
    this.router = express.Router()
    this.apiRoutes = []
    this.webRoutes = []
  }

  _attachRoutes(routeGroups, prefix = '') {
    routeGroups.forEach(({ group, routes }) => {
      routes.forEach(({ method, path, middleware = [], handler }) => {
        logger.info(`Route: ${method} ${prefix}${group.prefix}${path}`)
        this.router[method](
          prefix + group.prefix + path,
          [...(group.middleware || []), ...middleware],
          this._catchError(handler)
        )
      })
    })
  }

  _catchError(route) {
    return (req, res, next) => {
      route(req, res, next).catch(next)
    }
  }

  _handleExceptions() {
    this.router.use((err, _req, res, _next) => {
      const error = {
        statusCode: err.status || err.statusCode || statusCodes.INTERNAL_SERVER_ERROR,
      }

      if (err instanceof AppError) {
        error.message = err.message
        error.detail = err.detail
      }

      // Mongoose validation error
      if (err.name === 'ValidationError') {
        error.detail = Object.values(err.errors)
          .map((item) => item.message)
          .join(', ')
        error.statusCode = statusCodes.BAD_REQUEST
        error.message = reasonPhrases.BAD_REQUEST
      }

      // Mongoose duplicate error
      if (err.code && err.code === 11000) {
        error.statusCode = statusCodes.BAD_REQUEST
        error.message = reasonPhrases.BAD_REQUEST
        error.detail = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
      }

      // MOngoose validation error
      if (err.name === 'CastError') {
        error.statusCode = statusCodes.BAD_REQUEST
        error.message = reasonPhrases.BAD_REQUEST
        error.detail = `Invalid parameter: ${err.value}`
      }

      if (cnf.nodeEnv !== 'development' && !(err instanceof AppError)) {
        if (error.statusCode <= statusCodes.BAD_REQUEST) {
          error.message = reasonPhrases.BAD_REQUEST
        } else if (error.statusCode >= statusCodes.INTERNAL_SERVER_ERROR) {
          logger.error(err, 'Generic exception handler caught error:')
          error.message = reasonPhrases.INTERNAL_SERVER_ERROR
        }
      }

      return new JsonResponse(error.statusCode).error(res, error)
    })
  }

  _handlePageNotFound() {
    this.router.all('*', (req, res) => {
      return new JsonResponse(statusCodes.NOT_FOUND).error(res, reasonPhrases.NOT_FOUND)
    })
  }

  initializeRouter(app) {
    this._attachRoutes(this.apiRoutes, '/api')

    this._handlePageNotFound()
    this._handleExceptions()

    // register router
    app.use(this.router)
  }
}

const router = new Router()

// Export Singleton instance
export default router
