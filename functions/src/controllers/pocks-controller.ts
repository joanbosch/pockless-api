import { LatLong } from "../common/models/lat-long";
import { CreatePockRestInput } from "@/modules/pocks/models/create-pock-rest-input"
import { PockMessage } from "@/modules/pocks/models/pock-message"
import { GET, Path, POST, PreProcessor, QueryParam } from "typescript-rest"
import { Tags } from "typescript-rest-swagger";
import { AppClient } from "../common/auth/app-client"
import { appClientAuthenticator } from "../common/auth/app-client-authenticator"
import createPock from "../modules/pocks/actions/create-pock"
import getNearPocks from "../modules/pocks/actions/get-near-pocks"
import { BaseController } from "./base-controller"

/**
 * Pocks rest controller that manages all the endpoints that are in /pock.
 */
@Tags('Pocks') // for swagger documentation
@Path('/pock')
export class PocksRestController extends BaseController {
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @POST
    async createPockHandler(body: CreatePockRestInput): Promise<PockMessage> {
        return this.asPromise(createPock(body))
    }

    @GET
    async getNearPocksHandler(@QueryParam("latitude") lat: number, @QueryParam("longitude") long: number): Promise<PockMessage[]> {
        return this.asPromise(getNearPocks(lat, long))
    }
}
