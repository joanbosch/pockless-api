/**
 * Base controller that exposes some useful methods that would be a pain
 * to write in each endpoint
 */
export abstract class BaseController {
    /**
     * Handles the executor status as a Promise.
     *
     * Note: reject() goes directly to the middleware error handler
     *
     * @param executor  Executor to be executed and handle it's status and returned data
     */
    asPromise<T>(executor: any): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            let result
            try {
                result = await executor
            } catch (e) {
                reject(e)
            }
            resolve(result)
        })
    }
}
