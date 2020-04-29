import * as admin from "firebase-admin";
import { LIKES_REF, MESSAGES_REF } from "../../../common/paths";
import { PockMessage } from "../../pocks/models/pock-message";

export default async ({uid}: any): Promise<PockMessage[]> => {

    const likesSnapshot = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("user")
        .equalTo(uid)
        .once('value')

    const val = likesSnapshot.val()
    if (val == null || val.length == 0) {
        return []
    }

    return Promise.all(Object.values(val).map(async (like: any) => {
        const pock = await admin.database().ref(`${MESSAGES_REF}/${like.pock}`).once('value')
        return new PockMessage(Object.assign({}, pock.val(), {id: like.pock}))
    }))
}
