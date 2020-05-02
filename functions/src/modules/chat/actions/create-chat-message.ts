import * as admin from "firebase-admin";
import { CHAT_MESSAGES_REF, CHATS_REF, MESSAGES_REF } from "../../../common/paths";
import { ChatMessage } from "../models/chat-message";
import { CreateMessageRestInput } from "../models/create-message-rest-input";
import { ErrorResponse } from "../../../common/error";

/**
 * Inserts a new chat message on the database.
 *
 * @param input
 * @param user
 */
export default async (input: CreateMessageRestInput, user: any): Promise<ChatMessage> => {
    /*
    - Decide if we want the same endpoint to add new messages to an existing chat and to create a new chat.

    - (if yes) Decide how to organize messages and chat creation in this endpoint. Now, if the chatId of input has a certain value, it
    means that we want to create a new chat. Otherwise, we are going to insert to an existing chat the given message.

    - What information about the last message we want to put in the chat info? It will depend on what we want to show on the chats list.

    - Could exist two chats between the same 2 users?
     */
    if (input.chatId == 'new!' && input.pockId != null) {
        // 1. Check if pock exists
        const pockSnapshot = await admin.database().ref(`${MESSAGES_REF}/${input.pockId}`).once('value')
        if (pockSnapshot == null || pockSnapshot.val() == null) {
            throw new ErrorResponse(404, 'Could not create a chat for a pock that not exists')
        }

        // 2. Verify that pock creator is not the current user and chat is enabled on this pock
        if (pockSnapshot.val().user == user.uid) {
            throw new ErrorResponse(409, 'Could not create a chat with yourself')
        }
        if (!pockSnapshot.val().chatAccess) {
            throw new ErrorResponse(409, 'Could not create a chat for a pock with chat disabled')
        }

        // 3. Create chat
        const currentDate = Date.now()

        const newChatSnapshot = await admin.database().ref(`${CHATS_REF}`).push({
            user1: user.uid,
            user2: pockSnapshot.val().user,
            pock: input.pockId,
            lastMessage: input.text,
            date: currentDate
        })
        if (!newChatSnapshot) {
            throw new ErrorResponse(400, 'Could not create the chat')
        }

        const chatRef = newChatSnapshot.ref.toString().split('/')
        const chatId = chatRef[chatRef.length - 1]

        // 4. Insert first message
        const newMessageSnapshot = await admin.database().ref(`${CHAT_MESSAGES_REF}/${chatId}`).push({
            text: input.text,
            senderId: user.uid,
            read: false,
            date: currentDate
        })
        if (!newMessageSnapshot) {
            throw new ErrorResponse(400, 'Could not insert the message')
        }

        const msgRef = newMessageSnapshot.ref.toString().split('/')
        const msgId = msgRef[msgRef.length - 1]

        // 5. Return the inserted message
        const newMessage = await admin.database().ref(`${CHAT_MESSAGES_REF}/${chatId}/${msgId}`).once('value')

        return new ChatMessage(Object.assign({}, newMessage.val(), {id: newMessage.key, chatId}))
    } else {
        // 1. Check if a chat with chatId exists
        const chatSnapshot = await admin.database().ref(`${CHATS_REF}/${input.chatId}`).once('value')
        if (chatSnapshot == null || chatSnapshot.val() == null) {
            throw new ErrorResponse(404, 'This chat does not exist')
        }

        // 2. Check if current user is a member of this chat
        if (user.uid != chatSnapshot.val().user1 && user.uid != chatSnapshot.val().user2) {
            throw new ErrorResponse(403, 'You are not a member of this chat')
        }

        // 3. Insert message into database
        const snapshot = await admin.database().ref(`${CHAT_MESSAGES_REF}/${input.chatId}`).push({
            text: input.text,
            senderId: user.uid,
            read: false,
            date: Date.now()
        })
        if (!snapshot) {
            throw new ErrorResponse(400, 'Could not insert the message')
        }

        const ref = snapshot.ref.toString().split('/')
        const id = ref[ref.length - 1]

        // 4. Return the inserted message from database AND UPDATE LAST MESSAGE OF CHAT
        const newMessage = await admin.database().ref(`${CHAT_MESSAGES_REF}/${input.chatId}/${id}`).once('value')

        await admin.database().ref(`${CHATS_REF}/${input.chatId}`).update({
            lastMessage: newMessage.val().text,
            date: newMessage.val().date
        })

        return new ChatMessage(Object.assign({}, newMessage.val(), {id: newMessage.key, chatId: input.chatId}))
    }
}