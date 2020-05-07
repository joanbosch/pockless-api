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

    const currentUser = await admin.database().ref(`${PROFILE_REF}/${user.uid}`).once('value')
    const currentUserInfo = new UserProfileNameImage(Object.assign({}, currentUser.val(), {id: user.uid}))

    // 2. Return the chats obtained, sorted by the date of the last message
    // It seems that forEach is the only way to do a loop on a snapshot, but it does not allow awaits inside it.
    // To solve this I had to push the chats to array in a forEach and later fill the user information in a for loop.
    const result: Chat[] = []
    snapshot1.forEach((c: admin.database.DataSnapshot) => {
        result.push(new Chat(Object.assign({}, c.val(), {id: c.key, user1: currentUserInfo, user2: {id: c.val().user2, name: "", profileImageUrl: ""}})))
    })
    snapshot2.forEach((c: admin.database.DataSnapshot) => {
        result.push(new Chat(Object.assign({}, c.val(), {id: c.key, user1: {id: c.val().user1, name: "", profileImageUrl: ""}, user2: currentUserInfo})))
    })

    for (const r of result) {
        if (r.user1.profileImageUrl == "") {
            const otherUser = await admin.database().ref(`${PROFILE_REF}/${r.user1.id}`).once('value')
            r.user1.name = otherUser.val().name
            r.user1.profileImageUrl = otherUser.val().profileImageUrl
        } else {
            const otherUser = await admin.database().ref(`${PROFILE_REF}/${r.user2.id}`).once('value')
            r.user2.name = otherUser.val().name
            r.user2.profileImageUrl = otherUser.val().profileImageUrl
        }
    }

    return result.sort((a: Chat, b: Chat) => b.date - a.date)
}