import * as admin from "firebase-admin";
import { Category, sendMessage } from "../../messaging/actions/send-message";
import { ErrorResponse } from "../../../common/error";
import { CHAT_MESSAGES_REF, CHATS_REF, MESSAGES_REF, PROFILE_REF } from "../../../common/paths";
import { Message } from "../../messaging/models/message";
import { ChatMessage } from "../models/chat-message";
import { CreateMessageRestInput } from "../models/create-message-rest-input";

/**
 * Inserts a new chat message on the database.
 *
 * @param input
 * @param user
 */
export default async (input: CreateMessageRestInput, user: any): Promise<ChatMessage> => {
    if (input.chatId == null && input.pockId != null) {
        return createChatAndMessage(input.text, input.pockId, user.uid)
    } else if (input.chatId != null && input.pockId == null) {
        return createMessage(input.text, input.chatId, user.uid)
    } else {
        throw new ErrorResponse(400, 'You must provide a pockId if chat not exists or a chatId if chat already exists')
    }
}

const createChatAndMessage = async (text: string, pockId: string, userId: string): Promise<ChatMessage> => {
    // 1. Check if pock exists
    const pock = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).once('value')
    if (pock == null || pock.val() == null) {
        throw new ErrorResponse(400, 'Could not create a chat for a pock that not exists')
    }
    const pockAuthor = pock.val().user

    // 2. Verify that pock author is not the current user and chat is enabled on this pock
    if (pockAuthor == userId) {
        throw new ErrorResponse(409, 'Could not create a chat with yourself')
    }
    if (!pock.val().chatAccess) {
        throw new ErrorResponse(409, 'Could not create a chat for a pock with chat disabled')
    }

    // 3. Check if chat already exists
    const existingChat = await admin.database().ref(`${CHATS_REF}`)
        .orderByChild('composedKey')
        .equalTo(composeKeyUsers(userId, pockAuthor))
        .once('value')
    if (existingChat.val() != null) {
        throw new ErrorResponse(409, 'A chat with pock author already exists')
    }

    // 4. Create chat
    const dateInserted = Date.now()

    const newChatSnapshot = await admin.database().ref(`${CHATS_REF}`).push({
        composedKey: composeKeyUsers(userId, pockAuthor),
        user1: userId,
        user2: pockAuthor,
        pock: pockId,
        lastMessage: text,
        date: dateInserted
    })
    if (!newChatSnapshot) {
        throw new ErrorResponse(400, 'Could not create the chat')
    }

    const chatRef = newChatSnapshot.ref.toString().split('/')
    const chatId = chatRef[chatRef.length - 1]

    // 5. Insert first message
    const newMessageSnapshot = await admin.database().ref(`${CHAT_MESSAGES_REF}/${chatId}`).push({
        text,
        senderId: userId,
        read: false,
        date: dateInserted
    })
    if (!newMessageSnapshot) {
        throw new ErrorResponse(400, 'Could not insert the message')
    }

    const messageRef = newMessageSnapshot.ref.toString().split('/')
    const messageId = messageRef[messageRef.length - 1]

    // 6. Send notification / Return the inserted message
    const newMessage = await admin.database().ref(`${CHAT_MESSAGES_REF}/${chatId}/${messageId}`).once('value')

    await sendNotification(pockAuthor, userId, text)

    return new ChatMessage(Object.assign({}, newMessage.val(), {id: newMessage.key, chatId}))
}

const createMessage = async (text: string, chatId: string, userId: string): Promise<ChatMessage> => {
    // 1. Check if a chat with chatId exists
    const chatInfo = await admin.database().ref(`${CHATS_REF}/${chatId}`).once('value')
    if (chatInfo == null || chatInfo.val() == null) {
        throw new ErrorResponse(404, 'This chat does not exist')
    }

    // 2. Check if current user is a member of this chat
    if (userId != chatInfo.val().user1 && userId != chatInfo.val().user2) {
        throw new ErrorResponse(403, 'You are not a member of this chat')
    }

    // 3. Insert message into database
    const snapshot = await admin.database().ref(`${CHAT_MESSAGES_REF}/${chatId}`).push({
        text,
        senderId: userId,
        read: false,
        date: Date.now()
    })
    if (!snapshot) {
        throw new ErrorResponse(400, 'Could not insert the message')
    }

    const ref = snapshot.ref.toString().split('/')
    const messageId = ref[ref.length - 1]

    // 4. Update last message of chat / Send notification / Return the inserted message from database
    const newMessage = await admin.database().ref(`${CHAT_MESSAGES_REF}/${chatId}/${messageId}`).once('value')

    await admin.database().ref(`${CHATS_REF}/${chatId}`).update({
        lastMessage: text,
        date: newMessage.val().date
    })

    let receiver: string
    if (userId == chatInfo.val().user1) receiver = chatInfo.val().user2
    else receiver = chatInfo.val().user1
    await sendNotification(receiver, userId, text)

    return new ChatMessage(Object.assign({}, newMessage.val(), {id: newMessage.key, chatId}))
}

const composeKeyUsers = (user1: string, user2: string): string => {
    if (user1 < user2) return `${user1}_${user2}`
    return `${user2}_${user1}`
}

const sendNotification = async (receiverId: string, senderId: string, message: string) => {
    const sender = await admin.database().ref(`${PROFILE_REF}/${senderId}`).once('value')

    const notification: Message = {
        title: `New message from ${sender.val().name}`,
        content: message,
        type: Category.CHAT
    }
    await sendMessage(receiverId, notification)
}