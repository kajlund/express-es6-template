import { reasonPhrases, statusCodes } from './statuscodes.js'

export class AppError extends Error {
  constructor(message = reasonPhrases.INTERNAL_SERVER_ERROR, status = statusCodes.INTERNAL_SERVER_ERROR, detail = '') {
    super(message)
    this.status = status
    this.name = this.constructor.name
    this.detail = detail
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(detail) {
    super(reasonPhrases.BAD_REQUEST, statusCodes.BAD_REQUEST, detail)
  }
}

export class InternalServerError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, detail)
  }
}

export class MaximumFileSizeException extends AppError {
  constructor(size = 100) {
    super(reasonPhrases.BAD_REQUEST, statusCodes.BAD_REQUEST, `Maximum upload file size (${size}) exceeded`)
  }
}

export class NotFoundError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.NOT_FOUND, statusCodes.NOT_FOUND, detail)
  }
}

export class UnauthorizedError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.UNAUTHORIZED, statusCodes.UNAUTHORIZED, detail)
  }
}
