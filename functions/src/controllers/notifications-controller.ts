import {GET, Path, PreProcessor} from "typescript-rest";
import {appClientAuthenticator} from "../common/auth/app-client-authenticator";
import {AppClient} from "../common/auth/app-client";
import {Message} from "../modules/messaging/models/message";
import getAllNotifications from "../modules/messaging/actions/get-all-notifications"
import {BaseController} from "./base-controller";
import {Tags} from "typescript-rest-swagger";

@Tags('Notifications')
@Path('/notifications')
export class NotificationsRestController extends BaseController {

    @PreProcessor(appClientAuthenticator([AppClient.POCKLES]))
    @GET
    async getNotifications(): Promise<Message[]> {
        return this.asPromise(getAllNotifications())
    }
}