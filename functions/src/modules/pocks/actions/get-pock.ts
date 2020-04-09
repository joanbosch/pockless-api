import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { PockMessage } from "../models/pock-message"

export const MESSAGES_REF = '/messages'

/**
 *
 * Get a pock from the database with a specific id
 *
 * TODO: Return also username
 */
export default async (pockId: string): Promise<PockMessage> => {

    const db = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).once('value')

    //We throw a error if we haven't got any pock from DB
    if (!db) {
        throw new ErrorResponse(404, `Could not get the pock with id ${pockId}`)
    }

    const {
        message,
        location,
        dateInserted,
        mediaUrl,
        category,
        chatAccess
    } = db.val()

    return {
        id: pockId,
        message,
        location,
        dateInserted,
        category,
        chatAccess,
        media: mediaUrl,
    }
}
