import * as express from "express"

/**
 * Error object thrown by the controllers and ready with the data for the {@link #errorHandler}
 */
export class ErrorResponse {
    statusCode: number
    message: string

    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode
        this.message = message
    }
}

/**
 * Custom middleware for the express app to handle all the errors that occurs in the app.
 *
 * All the errors must be {@link ErrorResponse} so the handler can return the correct status
 * with a suitable message for it.
 * @param err
 * @param res
 */
export const errorHandler = (err: ErrorResponse, res: express.Response) => {
    const { statusCode, message } = err
    res.status(statusCode).json({
        message,
        timestamp: Date.now()
    })
}
