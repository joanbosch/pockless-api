import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { MESSAGES_REF } from "../../../common/paths";
import addLocation from '../../geolocation/actions/add-location'
import { CreatePockRestInput } from "../models/create-pock-rest-input"
import { PockMessage } from "../models/pock-message"

export const DEFAULT_EXPIRATION_TIME = 7 * 24 * 3600 * 1000 // 1 week

/**
 * Inserts a new pock on the database.
 *
 * Note: It could be made with a transaction instead of the 'rollback' it
 * is applying in the try-catch.
 *
 * @param input
 * @param user
 */
export default async (input: CreatePockRestInput, user: any): Promise<PockMessage> => {
    // Step 2: Insert into database
    const snapshot =
        await admin.database().ref(MESSAGES_REF).push({
            dateInserted: Date.now(),
            dateExpiration: Date.now() + DEFAULT_EXPIRATION_TIME,
            user: user.uid,
            ...input
        })

    if (!snapshot) {
        throw new ErrorResponse(418, 'Could not insert the pock')
    }

    const ref = snapshot.ref.toString().split('/')
    const id = ref[ref.length - 1]

    // Step 3: If correctly inserted, insert the location
    try {
        const locationInserted = await addLocation(input.location, id)
        if (!locationInserted) {
            throw new ErrorResponse(418, 'Could not insert location')
        }
    } catch (e) {
        await admin.database().ref(`${MESSAGES_REF}/${id}`).remove()
        // Rethrow exception so the error handler can handle it, this catch is for a rollback when
        // the location could not be inserted correctly
        throw e
    }

    // Step 4: Return the freshly inserted pock from the database
    const pockInserted = await admin.database().ref(`${MESSAGES_REF}/${id}`).once('value')

    //Check Achievement: Primer Pock

    //Check Achievement: 10 Pock

    //Check Achievement: 100 Pock

    //Check Achievement: 1000 Pock

    //Check Achievement: 517 Pock

    //Check Achievement: 12 Pock salud

    //Check Achievement: 1 mes sin Pock

    //Check Achievement: 1 pock a las 8:00Am

    //Check Achievement: 1 pock/dia durante 10

    //Check Achievement: Que punteria

    return new PockMessage(Object.assign({}, pockInserted.val(), {id: pockInserted.key}))
}
