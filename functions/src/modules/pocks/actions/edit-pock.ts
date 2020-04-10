import { ErrorResponse } from "../../../common/error";
import { CreatePockRestInput, validateCreatePockRestInput } from "../models/create-pock-rest-input";
import { PockMessage } from "../models/pock-message";
import * as admin from "firebase-admin";

const MESSAGES_REF = '/messages'
const EDITABLE_TIME = 20 * 60 * 1000 // 20 minutes
/**
 * Edits the content of an existing pock on the database.
 *
 * It must be reviewed when users are implemented in order to ensure that only the creator can
 * edit his pocks.
 *
 * @param id
 * @param input
 * @param user
 */
export default async (id: string, input: CreatePockRestInput, user: any): Promise<PockMessage> => {
    /*
    Input type must be changed to EditPockRestInput (for example).
    It would include message and maybe chatAccess, category or mediaUrl too.
     */

    // Step 1: validate input (it does not sanitize it)
    if (!validateCreatePockRestInput(input)) {
        throw new ErrorResponse(400, 'Some of the fields are not correct')
    }

    // Step 2: check if exists a pock with the given id
    const snapshot = await admin.database().ref(`${MESSAGES_REF}/${id}`).once('value')
    if (!snapshot) {
        throw new ErrorResponse(404, 'Could not find this pock')
    }

    // Step 3: check if the pock is editable
    const {user: creator, dateInserted} = snapshot.val()
    if (creator != user.uid) {
        throw new ErrorResponse(403, 'You have not created this pock')
    }
    if (Date.now() > dateInserted + EDITABLE_TIME) {
        throw new ErrorResponse(400, 'Could not edit this pock')
    }

    // Step 4: update the pock with the new values
    await admin.database().ref(`${MESSAGES_REF}/${id}`).update({
        ...input
    })

    // Step 5: return the edited pock
    const editedPock = await admin.database().ref(`${MESSAGES_REF}/${id}`).once('value')
    const {
        message,
        location,
        mediaUrl,
        category,
        chatAccess
    } = editedPock.val()

    return {
        id,
        message,
        location,
        dateInserted,
        category,
        chatAccess: !!chatAccess ? chatAccess : false,
        media: mediaUrl,
        user: creator
    }
}