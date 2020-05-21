import { ErrorResponse } from "../../../common/error";
import { EditPockRestInput } from "../models/edit-pock-rest-input";
import { PockMessage } from "../models/pock-message";
import * as admin from "firebase-admin";
import { MESSAGES_REF } from "../../../common/paths";

/**
 * Edits the content of an existing pock on the database.
 *
 * Only the pock author can edit it.
 *
 * @param id
 * @param input
 * @param user
 */
export default async (id: string, input: EditPockRestInput, user: any): Promise<PockMessage> => {

    // Step 2: check if exists a pock with the given id
    const snapshot = await admin.database().ref(`${MESSAGES_REF}/${id}`).once('value')
    if (snapshot == null || snapshot.val() == null) {
        throw new ErrorResponse(404, 'Could not find this pock')
    }

    // Step 3: check if the pock is editable (current user is creator and message is editable yet)
    const {user: creator, dateInserted} = snapshot.val()
    if (creator != user.uid) {
        throw new ErrorResponse(403, 'You have not created this pock')
    }
    const originalPock = new PockMessage(snapshot.val())
    if (!originalPock.editable) {
        throw new ErrorResponse(409, 'Could not edit this pock')
    }

    // Step 4: update the pock with the new values
    await admin.database().ref(`${MESSAGES_REF}/${id}`).update({
        ...input
    })

    // Step 5: return the edited pock
    const editedPock = await admin.database().ref(`${MESSAGES_REF}/${id}`).once('value')

    return new PockMessage(Object.assign({}, editedPock.val(), {id: editedPock.key}))
}