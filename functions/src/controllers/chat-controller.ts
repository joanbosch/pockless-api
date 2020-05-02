import { ChatMessage } from "../modules/chat/models/chat-message";
import { CreateMessageRestInput } from "../modules/chat/models/create-message-rest-input";
import { AppClient } from "../common/auth/app-client";
import { appClientAuthenticator } from "../common/auth/app-client-authenticator";
import { userAuthentication } from "../common/auth/user-authenticator";
import { BaseController } from "./base-controller";
import { Path, POST, PreProcessor } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import createChatMessage from "../modules/chat/actions/create-chat-message"

/**
 * Chat rest controller that manages all the endpoints that ate in /chat.
 */
@Tags('Chat')
@Path('/chat')
export class ChatRestController extends BaseController {
    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/newmessage')
    @POST
    async createChatMessageHandler(body: CreateMessageRestInput): Promise<ChatMessage> {
        this.validate(body, CreateMessageRestInput.name)
        return this.asPromise(createChatMessage, body)
    }
}