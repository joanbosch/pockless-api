import * as admin from "firebase-admin";
import { UserProfileNameImage } from "../../user/model/user-profile-name-image";
import { ErrorResponse } from "../../../common/error";
import { CHATS_REF, PROFILE_REF } from "../../../common/paths";
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
        throw new ErrorResponse(400, 'Could not get any chat')
    }

    // 2. Return the chats obtained, sorted by the date of the last message

    const result: Chat[] = []
    snapshot1.forEach((c: admin.database.DataSnapshot) => {
        result.push(new Chat(Object.assign({}, c.val(), {id: c.key, user1: user.uid, user2: {id: c.val().user2, name: "", profileImageUrl: ""}})))
    })
    snapshot2.forEach((c: admin.database.DataSnapshot) => {
        result.push(new Chat(Object.assign({}, c.val(), {id: c.key, user1: user.uid, user2: {id: c.val().user1, name: "", profileImageUrl: ""}})))
    })

    result.sort((a: Chat, b: Chat) => b.date - a.date)

    return Promise.all(result.map(async (chat: Chat) => {
        const otherUserSnapshot = await admin.database().ref(`${PROFILE_REF}/${chat.user2.id}`).once('value')
        const otherUserInfo = new UserProfileNameImage(Object.assign({}, otherUserSnapshot.val()))
        return new Chat(Object.assign({}, chat, {user2: otherUserInfo}))
    }))

}