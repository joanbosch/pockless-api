import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { CHATS_REF } from "../../../common/paths";
import { Chat } from "../models/chat";

/**
 * Returns all the chats from the logged user.
 *
 * @param user
 */
export default async (user: any): Promise<Chat[]> => {
    // 1. Get chats where user is a member
    const snapshot1 = await admin.database().ref(CHATS_REF)
        .orderByChild('user1')
        .equalTo(user.uid)
        .once('value')

    const snapshot2 = await admin.database().ref(CHATS_REF)
        .orderByChild('user2')
        .equalTo(user.uid)
        .once('value')

    if (!snapshot1 && !snapshot2) {
        throw new ErrorResponse(404, 'Could not get any chat')
    }

    // 2. Return the chats obtained, sorted by the date of the last message
    const result: Chat[] = []
    snapshot1.forEach((c: admin.database.DataSnapshot) => {
        result.push(new Chat(Object.assign({}, c.val(), {id: c.key})))
    })
    snapshot2.forEach((c: admin.database.DataSnapshot) => {
        result.push(new Chat(Object.assign({}, c.val(), {id: c.key})))
    })

    return result.sort((a: Chat, b: Chat) => b.date - a.date)
}