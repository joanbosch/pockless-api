import { ChatRestController } from "./chat-controller";
import { UserRestController } from "./user-controller";
import { PocksRestController } from "./pocks-controller";

/**
 * Centralized export for all the controllers.
 *
 * No need to modify the index file to add a new controller.
 */
export default [
    PocksRestController,
    UserRestController,
    ChatRestController
]
