import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import {LIKES_REF, MESSAGES_REF, PROFILE_REF, REPORTS_REF} from "../../../common/paths";
import { PockMessage } from "../models/pock-message"
import { composeKey } from "./like-pock";
import {composeKeyReport} from "./report-pock";

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
    const {name, profileImageUrl} = userProfileSnapshot.val() || ""

    const likesSnapshot = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("pock")
        .equalTo(pockId)
        .once('value')

    const likes = likesSnapshot.val() != null ? Object.keys(likesSnapshot.val()).length : 0

    const likedSnapshot = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("composedKey")
        .equalTo(composeKey(pockId, uid))
        .once('value')

    //see if the pock has already been reported by user
    const pockReported = await admin.database().ref(`${REPORTS_REF}`)
        .orderByChild("composeKeyReport")
        .equalTo(composeKeyReport(pockId, uid))
        .once('value')


    return new PockMessage(Object.assign(
        {},
        db.val(),
        {id: pockId, user, username: name, likes, liked: likedSnapshot.val() != null, userProfileImage: profileImageUrl, reported:pockReported.val() != null}))
}
