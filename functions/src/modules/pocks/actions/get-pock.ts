import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { LIKES_REF, MESSAGES_REF, PROFILE_REF } from "../../../common/paths";
import { PockMessage } from "../models/pock-message"
import { composeKey } from "./like-pock";

/**
 * Get a pock from the database with a specific id
 */
export default async (pockId: string, {uid}: any): Promise<PockMessage> => {

    const db = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).once('value')

    //We throw an error if we haven't got any pock from DB
    if (db == null || db.val() == null) {
        throw new ErrorResponse(404, `Could not get the pock with id ${pockId}`)
    }

    const {user} = db.val()

    const userProfileSnapshot = await admin.database().ref(`${PROFILE_REF}/${user}`).once('value')
    const {name} = userProfileSnapshot.val() || ""

    const likesSnapshot = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("pock")
        .equalTo(pockId)
        .once('value')

    const likes = likesSnapshot.val() != null ? Object.keys(likesSnapshot.val()).length : 0

    const canLikeSnapshot = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("composedKey")
        .equalTo(composeKey(pockId, uid))
        .once('value')

    const canLike = canLikeSnapshot.val() == null

    return new PockMessage(Object.assign(
        {},
        db.val(),
        {id: pockId, user, username: name, likes, canLike}))
}
