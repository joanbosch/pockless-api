import { GET, Path, PathParam, POST, PreProcessor, QueryParam } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { AppClient } from "../common/auth/app-client";
import { appClientAuthenticator } from "../common/auth/app-client-authenticator";
import { userAuthentication } from "../common/auth/user-authenticator";
import createChatMessage from "../modules/chat/actions/create-chat-message"
import getChatMessages from "../modules/chat/actions/get-chat-messages"
import getUserChats from "../modules/chat/actions/get-user-chats"
import { Chat } from "../modules/chat/models/chat";
import { ChatMessage } from "../modules/chat/models/chat-message";
import { CreateMessageRestInput } from "../modules/chat/models/create-message-rest-input";
import { BaseController } from "./base-controller";

/**
 * Chat rest controller that manages all the endpoints that ate in /chat.
 */
@Tags('Chat')
@Path('/chat')
export class ChatRestController extends BaseController {
    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @GET
    async getUserChatsHandler(): Promise<Chat[]> {
        return this.asPromise(getUserChats)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/:id')
    @GET
    async getChatMessagesHandler(@PathParam("id") id: string, @QueryParam("fromPock") fromPock: boolean): Promise<ChatMessage[]> {
        return this.asPromise(getChatMessages, id, fromPock)
    }

    @PreProcessor(userAuthentication)
    @PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))
    @Path('/message')
    @POST
    async createChatMessageHandler(body: CreateMessageRestInput): Promise<ChatMessage> {
        this.validate(body, CreateMessageRestInput.name)
        return this.asPromise(createChatMessage, body)
    }
}
