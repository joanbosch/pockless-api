import * as express from "express"

/**
 * Error object thrown by the controllers and ready with the data for the {@link #errorHandler}
 */
export class ErrorResponse {
    statusCode: number
    errorMessage: string
    errorDescription?: string

    constructor(statusCode: number, message: string);
    constructor(statusCode: number, message: string, errorDescription: string);
    constructor(statusCode: number, message: string, errorDescription?: string) {
        this.statusCode = statusCode
        this.errorMessage = message
        this.errorDescription = errorDescription
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
export const errorHandler = (err: ErrorResponse | any, res: express.Response) => {
    console.error(err)
    const {statusCode = 500, errorMessage, errorDescription} = err || {}
    const json = {
        message: errorMessage || "Unknown error",
        timestamp: Date.now()
    }

    if (!!errorDescription) {
        Object.assign(json, {description: errorDescription})
    }

    res.status(statusCode).json(json)
}
