import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { MESSAGES_REF, PROFILE_REF } from "../../../common/paths";
import { PockMessage } from "../models/pock-message"

/**
 * Get a pock from the database with a specific id
 */
export default async (pockId: string): Promise<PockMessage> => {

    const db = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).once('value')

    //We throw an error if we haven't got any pock from DB
    if (db == null || db.val() == null) {
        throw new ErrorResponse(404, `Could not get the pock with id ${pockId}`)
    }

    const {user} = db.val()

    const userProfileSnapshot = await admin.database().ref(`${PROFILE_REF}/${user}`).once('value')
    const {name} = userProfileSnapshot.val() || ""

    return new PockMessage(Object.assign({}, db.val(), {id: pockId}, {user, username: name}))
}
