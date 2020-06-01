import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { CHAT_MESSAGES_REF, CHATS_REF } from "../../../common/paths";
import { ChatMessage } from "../models/chat-message";

/**
 * Returns all the messages from the given chat
 *
 * @param id
 * @param isPock
 * @param user
 */
export default async (id: string | null, isPock: boolean, user: any): Promise<ChatMessage[]> => {
    // 1. Check if chat exists

    let chatSnapshot
    if (isPock) {
        const snapshot = await admin.database().ref(`${CHATS_REF}`).orderByChild('pock').equalTo(id).once('value')
        snapshot.forEach(snap => {
            const s = snap.val()
            if (s.user1 === user.uid || s.user2 === user.uid) {
                chatSnapshot = snap
                id = snap.key
            }
        })
    } else {
        chatSnapshot = await admin.database().ref(`${CHATS_REF}/${id}`).once('value')
    }
    if (chatSnapshot == null || chatSnapshot.val() == null) {
        throw new ErrorResponse(404, 'Not exists a chat with that id')
    }

    // 2. Check if user is a member of the chat
    if (user.uid != chatSnapshot.val().user1 && user.uid != chatSnapshot.val().user2) {
        throw new ErrorResponse(403, 'You are not a member of this chat')
    }

    // 3. Get the messages
    const messagesSnapshot = await admin.database().ref(`${CHAT_MESSAGES_REF}/${id}`)
        .orderByChild('date')
        .once('value')

    const result: ChatMessage[] = []
    messagesSnapshot.forEach((m: admin.database.DataSnapshot) => {
        result.push(new ChatMessage(Object.assign({}, m.val(), {id: m.key, chatId: id})))
    })

    // 4. Set messages sent by the other member as read
    // Last message is most recent. The loop stops when finds a message from the other user already read.
    for (let i: number = result.length - 1; i >= 0 && (result[i].senderId == user.uid || !result[i].read); i--) {
        if (result[i].senderId != user.uid && !result[i].read) {
            await admin.database().ref(`${CHAT_MESSAGES_REF}/${id}/${result[i].id}`).update({
                read: true
            })
        }
    }

    return result
}
