export class BaseController {
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
