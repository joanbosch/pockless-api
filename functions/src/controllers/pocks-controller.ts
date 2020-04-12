import admin from "firebase-admin";
import { DELETE, GET, Path, PathParam, POST, PreProcessor, QueryParam } from "typescript-rest"
import { Tags } from "typescript-rest-swagger";
import { AppClient } from "../common/auth/app-client"
import { appClientAuthenticator } from "../common/auth/app-client-authenticator"
import { userAuthentication } from "../common/auth/user-authenticator";
import { LatLong } from "../common/models/lat-long";
import createPock from "../modules/pocks/actions/create-pock"
import deleteLikePock from "../modules/pocks/actions/delete-like-pock"
import historyPocks from "../modules/pocks/actions/get-history-pocks"
import getNearPocks from "../modules/pocks/actions/get-near-pocks"
import getPock from "../modules/pocks/actions/get-pock"
import likePock from "../modules/pocks/actions/like-pock"
import { CreatePockRestInput } from "../modules/pocks/models/create-pock-rest-input"
import { PockMessage } from "../modules/pocks/models/pock-message";
import { BaseController } from "./base-controller"

/**
 * Pocks rest controller that manages all the endpoints that are in /pock.
 */
@Tags('Pocks') // for swagger documentation
@Path('/pock')
export class PocksRestController extends BaseController {
    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @POST
    async createPockHandler(body: CreatePockRestInput): Promise<PockMessage> {
        this.validate(body, CreatePockRestInput.name)
        return this.asPromise(createPock, body)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @GET
    async getNearPocksHandler(@QueryParam("latitude") latitude: number, @QueryParam("longitude") longitude: number): Promise<PockMessage[]> {
        const latLong: LatLong = new LatLong({latitude, longitude})
        this.validate(latLong, LatLong.name)
        return this.asPromise(getNearPocks, latLong)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/history')
    @GET
    async getPocksHist(): Promise<PockMessage[]> {
        return this.asPromise(historyPocks)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/:id')
    @GET
    async getMessageById(@PathParam("id") id: string): Promise<PockMessage> {
        return this.asPromise(getPock, id)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/:id/like')
    @POST
    async likePock(@PathParam("id") id: string): Promise<PockMessage> {
        return this.asPromise(likePock, id)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/:id/like')
    @DELETE
    async removeLikePock(@PathParam("id") id: string): Promise<PockMessage> {
        return this.asPromise(deleteLikePock, id)
    }
}
