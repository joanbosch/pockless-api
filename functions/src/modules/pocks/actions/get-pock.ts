import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { PockMessage } from "../models/pock-message"

export const MESSAGES_REF = '/messages'

/**
 *
 * Get a pocks from the database with a specific id
 *
 * Return a pock with a specific id
 *
 * Must be reviewed when the distance system restriction and user system is implemented
 *
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
        chatAccess: !!chatAccess ? chatAccess : false,
        media: mediaUrl,
        user: '0'
    }
}
