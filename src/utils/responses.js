import { statusCodes } from './statuscodes.js'

export default class JsonResponse {
  constructor(statusCode = statusCodes.OK) {
    this.statusCode = statusCode
  }

  error(res, message, error) {
    return res.status(this.statusCode).json({
      success: false,
      message: error.message,
      detail: error.detail,
    })
  }

  success(res, message, data) {
    return res.status(this.statusCode).json({
      success: true,
      message,
      data,
    })
  }
}
