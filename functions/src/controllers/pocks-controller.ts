import { Path, POST } from "typescript-rest"
import createPock from "../modules/pocks/actions/create-pock";
import { CreatePockRestInput } from "@/modules/pocks/models/create-pock-rest-input";
import { PockMessage } from "@/modules/pocks/models/pock-message";
import { BaseController } from "./base-controller";
import { Tags } from "typescript-rest-swagger";

@Tags('Pocks')
@Path('/pock')
export class PocksRestController extends BaseController {
    @POST
    async createPockHandler(body: CreatePockRestInput): Promise<PockMessage> {
        return this.asPromise(createPock(body))
    }
}
