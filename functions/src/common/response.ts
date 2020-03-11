import { ReferencedResource } from "typescript-rest";

export class ApiResponse<T> extends ReferencedResource<T> {
    constructor(data: T, code?: number) {
        super('', !!code ? code : 200 );
        this.body = data
    }

}


