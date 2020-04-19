import { GET, Path, PathParam, POST, PreProcessor } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { AppClient } from "../common/auth/app-client";
import { appClientAuthenticator } from "../common/auth/app-client-authenticator";
import { userAuthentication } from "../common/auth/user-authenticator";
import { BaseController } from "../controllers/base-controller";
import getProfile from "../modules/user/actions/get-profile";
import userExists from "../modules/user/actions/get-user-exists";
import { CreateUserRestInput } from "../modules/user/model/create-user-rest-input";
import { UserProfile } from "../modules/user/model/user-profile";
import createUser from "./../modules/user/actions/create-user";

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
    @GET
    @Path('/:id/exists')
    async userExists(@PathParam("id") id: string): Promise<Boolean> {
        return this.asPromise(userExists, id)
    }

    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @POST
    async createUser(body: CreateUserRestInput): Promise<Boolean> {
        this.validate(body, CreateUserRestInput.name)
        return this.asPromise(createUser, body)
    }
}
