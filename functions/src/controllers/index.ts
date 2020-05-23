import { AchievementRestController } from "./achievement-controller";
import { ChatRestController } from "./chat-controller";
import { PocksRestController } from "./pocks-controller";
import {NotificationsRestController} from "./notifications-controller";
import { UserRestController } from "./user-controller";

/**
 * Centralized export for all the controllers.
 *
 * No need to modify the index file to add a new controller.
 */
export default [
    PocksRestController,
    UserRestController,
    ChatRestController,
    AchievementRestController,
    ChatRestController,
    NotificationsRestController
]
