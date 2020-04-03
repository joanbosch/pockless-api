import { GET, Path, PathParam, POST, PUT, PreProcessor, QueryParam } from "typescript-rest"
import { Tags } from "typescript-rest-swagger";
import { AppClient } from "../common/auth/app-client"
import { appClientAuthenticator } from "../common/auth/app-client-authenticator"
import allPocks from "../modules/pocks/actions/all-pocks"
import createPock from "../modules/pocks/actions/create-pock"
import getNearPocks from "../modules/pocks/actions/get-near-pocks"
import viewPock from "../modules/pocks/actions/get-pock"
import editPock from "../modules/pocks/actions/edit-pock"
import { CreatePockRestInput } from "../modules/pocks/models/create-pock-rest-input"
import { PockMessage } from "../modules/pocks/models/pock-message"
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

    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @GET
    async getNearPocksHandler(@QueryParam("latitude") lat: number, @QueryParam("longitude") long: number): Promise<PockMessage[]> {
        return this.asPromise(getNearPocks(lat, long))
    }

    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/history')
    @GET
    async getAllMessagesHandler(): Promise<PockMessage[]> {
        return this.asPromise(allPocks())
    }

    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/:id')
    @GET
    async getMessageById(@PathParam("id") id: string): Promise<PockMessage> {
        return this.asPromise(viewPock(id))
    }

    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/:id')
    @PUT
    async editPockHandler(@PathParam("id") id: string, body: CreatePockRestInput): Promise<PockMessage> {
        return this.asPromise(editPock(id, body))
    }
}
