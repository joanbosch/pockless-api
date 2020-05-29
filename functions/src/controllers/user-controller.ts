import {GET, PATCH, Path, PathParam, POST, PreProcessor, PUT} from "typescript-rest"
import { Tags } from "typescript-rest-swagger";
import { AppClient } from "../common/auth/app-client";
import { appClientAuthenticator } from "../common/auth/app-client-authenticator";
import { userAuthentication } from "../common/auth/user-authenticator";
import { BaseController } from "../controllers/base-controller";
import historyPocks from "../modules/pocks/actions/get-history-pocks";
import { PockMessage } from "../modules/pocks/models/pock-message";
import getProfile from "../modules/user/actions/get-profile";
import userExists from "../modules/user/actions/get-user-exists";
import { CreateUserRestInput } from "../modules/user/model/create-user-rest-input";
import { UserProfile } from "../modules/user/model/user-profile";
import createUser from "./../modules/user/actions/create-user";
import insertToken from "./../modules/messaging/actions/insert-token";
import {InsertTokenRestInput} from "../modules/user/model/insert-token-rest-input";
import getLikes from "./../modules/user/actions/get-likes"
import {EditUserProfileRestInput} from "../modules/user/model/edit-user-profile-rest-input";
import editUserProfile from "./../modules/user/actions/edit-user-profile"
import getUserById from "./../modules/user/actions/get-user-by-id"
import {ViewOtherUser} from "../modules/user/model/view-other-user";

@Tags('Users')
@Path('/user')
export class UserRestController extends BaseController {

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @GET
    async getUser(): Promise<UserProfile> {
        return this.asPromise(getProfile)
    }

    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @POST
    async createUser(body: CreateUserRestInput): Promise<Boolean> {
        this.validate(body, CreateUserRestInput.name)
        return this.asPromise(createUser, body)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/history')
    @GET
    async getAllMessagesHandler(): Promise<PockMessage[]> {
        return this.asPromise(historyPocks)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/likes')
    @GET
    async getUserLikesHandler(): Promise<PockMessage[]> {
        return this.asPromise(getLikes)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([AppClient.POCKLES]))
    @PUT
    @Path('/token')
    async insertToken(body: InsertTokenRestInput): Promise<Boolean> {
        return this.asPromise(insertToken, body)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @PATCH
    async editUserProfileHandler(body: EditUserProfileRestInput): Promise<UserProfile> {
        this.validate(body, EditUserProfileRestInput.name)
        return this.asPromise(editUserProfile, body)
    }

    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @GET
    @Path('/:id/exists')
    async userExists(@PathParam("id") id: string): Promise<Boolean> {
        return this.asPromise(userExists, id)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/:id')
    @GET
    async getUserById(@PathParam("id") id: string): Promise<ViewOtherUser> {
        return this.asPromise(getUserById, id)
    }
}
