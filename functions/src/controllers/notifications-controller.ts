import {GET, Path, PreProcessor} from "typescript-rest";
import {appClientAuthenticator} from "../common/auth/app-client-authenticator";
import {AppClient} from "../common/auth/app-client";
import getAllNotifications from "../modules/messaging/actions/get-all-notifications"
import {BaseController} from "./base-controller";
import {Tags} from "typescript-rest-swagger";
import {NotificationMessage} from "../modules/messaging/models/message-output";
import {userAuthentication} from "../common/auth/user-authenticator";

@Tags('Notifications')
@Path('/notifications')
export class NotificationsRestController extends BaseController {

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([AppClient.POCKLES]))
    @GET
    async getNotifications(): Promise<NotificationMessage[]> {
        return this.asPromise(getAllNotifications)
    }
}