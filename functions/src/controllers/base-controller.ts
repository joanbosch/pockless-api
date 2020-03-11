import { ApiResponse } from "@/common/response";

export class BaseController {
    asPromise<T>(executor: any): Promise<T> {
        return new Promise<T>(async resolve => {
            resolve(await executor)
        })
    }
}
