import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import addLocation from '../../geolocation/actions/add-location'
import { CreatePockRestInput, validateCreatePockRestInput } from "../models/create-pock-rest-input";
import { PockMessage } from "../models/pock-message";

const MESSAGES_REF = '/messages'

/**
 * Inserts a new pock on the database.
 *
 * Note: It could be made with a transaction instead of the 'rollback' it
 * is applying in the try-catch.
 *
 * @param input
 */
export default async (input: CreatePockRestInput): Promise<PockMessage> => {

    // Step 1: validate input (it does not sanitize it)
    if (!validateCreatePockRestInput(input)) {
        throw new ErrorResponse(400, 'Some of the fields are not correct')
    }

    // Step 2: Insert into database
    const snapshot =
        await admin.database().ref(MESSAGES_REF).push({dateInserted: Date.now(), ...input})

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
    const {
        message,
        location,
        dateInserted,
        mediaUrl
    } = pockInserted.val()

    return {
        id,
        message,
        location,
        dateInserted,
        media: mediaUrl,
        user: '0'
    }
}
