import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { PockMessage } from "../models/pock-message"

export const MESSAGES_REF = '/messages'
export const DEFAULT_EXPIRATION_TIME = 7 * 24 * 3600 * 1000 // 1 week

/**
 * Get all pocks in the database.
 *
 * Must be reviewed when "log-in" funcionality is avaliable.
 *
 */
export default async (user: any): Promise<PockMessage[]> => {
    // Step 1: validate input. ¡Nothing must be validated!
    const returnPocksList: PockMessage[] = []

    // Step 2: Get all Pocks from DataBase
    const snapshot = await admin.database().ref(MESSAGES_REF).orderByChild('user').equalTo(user.uid).once('value')
    if (!snapshot) {
        //Review ErrorResponse statusCode, 418 means "I'm a teapot!"
        throw new ErrorResponse(418, 'Could not get all pocks')
    }

    snapshot.forEach((pock) => {
        const {
            key,
            message,
            location,
            dateInserted,
            mediaUrl,
            category,
            chatAccess
        } = pock.val()

        returnPocksList.push({
            id: key,
            message,
            location,
            dateInserted,
            category,
            chatAccess: !!chatAccess ? chatAccess : false,
            media: mediaUrl
        })
    })

    return returnPocksList
}
