import * as express from "express"

export class ErrorResponse extends Error {
    statusCode: number
    message: string

    constructor(statusCode: number, message: string) {
        super(message)
        this.statusCode = statusCode
        this.message = message
    }
}

export const errorHandler = (err: ErrorResponse, res: express.Response) => {
    const { statusCode, message } = err
    res.status(statusCode).json({
        message,
        timestamp: Date.now()
    })
}
