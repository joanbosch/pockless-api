import { errorHandler, ErrorResponse } from "..";

const errorCode = 500
const errorMessage = 'Service unavailable'
const errorDescription = 'Service is down or in maintenance'

const status = jest.fn()
const json = jest.fn()
const res = {
    status: (code: number) => {
        status(code)
        return res
    },
    json: (data: any) => {
        json(data)
        return res
    }
}

describe('ErrorHandler', () => {
    describe('given an errorResponse with all fields', () => {
        const error = new ErrorResponse(errorCode, errorMessage, errorDescription)

        it('should return all fields correctly', () => {
            // @ts-ignore
            errorHandler(error, res)

            expect(status).toBeCalledWith(errorCode)
            expect(json).toBeCalledWith(expect.objectContaining({message: errorMessage, description: errorDescription}))
        });
    })

    describe('given an errorResponse with no description', () => {
        const error = new ErrorResponse(errorCode, errorMessage)
        it('should return all fields except description', function () {
            // @ts-ignore
            errorHandler(error, res)

            expect(status).toBeCalledWith(errorCode)
            expect(json).toBeCalledWith(expect.objectContaining({message: errorMessage}))
        });
    })
});
