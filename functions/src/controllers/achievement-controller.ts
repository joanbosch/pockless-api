import { GET, Path, PreProcessor } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { AppClient } from "../common/auth/app-client";
import { appClientAuthenticator } from "../common/auth/app-client-authenticator";
import { userAuthentication } from "../common/auth/user-authenticator";
import getAchievements from "../modules/achievements/actions/achievement-getter"
import { Achievement } from "../modules/achievements/models/achievement";
import { BaseController } from "./base-controller";

@Tags('Achievement')
@Path('/achievement')
export class AchievementRestController extends BaseController {
    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @GET
    async handleGetAchievements(): Promise<Achievement[]> {
        return this.asPromise(getAchievements)
    }
}
