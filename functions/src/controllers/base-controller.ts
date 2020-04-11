/**
 * Base controller that exposes some useful methods that would be a pain
 * to write in each endpoint
 */
import { Context, ServiceContext } from "typescript-rest";
import { validateSync } from "yup-decorator";
import { ErrorResponse } from "../common/error/index";

export abstract class BaseController {
    @Context
        // @ts-ignore
    context: ServiceContext;

    /**
     * Handles the executor status as a Promise and injects the user as the last parameter.
     *
     * Note: reject() goes directly to the middleware error handler
     *
     * @param executor   Executor to be executed and handle it's status and returned data
     * @param parameters Parameters of the executor
     */
    asPromise<T>(executor: any, ...parameters: any): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            let result
            try {
                result = await executor(...parameters, this.context.request.user)
            } catch (e) {
                reject(e)
            }
            resolve(result)
        })
    }

    validate(object: object, type: string) {
        try {
            validateSync({object: object, schemaName: type})
        } catch (e) {
            throw new ErrorResponse(400, 'Some fields are not correct', e.errors)
        }
    }
}
