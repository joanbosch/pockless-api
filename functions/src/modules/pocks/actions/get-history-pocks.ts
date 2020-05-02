import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { MESSAGES_REF } from "../../../common/paths";
import { PockMessage } from "../models/pock-message"
import {Message} from "../../messaging/models/message";
import {Category, sendMessage} from "../../messaging/actions/send-message";

/**
 * Get all pocks in the database for an user.
 */
export default async (user: any): Promise<PockMessage[]> => {
    // Step 2: Get all Pocks from DataBase
    const snapshot = await admin.database().ref(MESSAGES_REF)
        .orderByChild('user')
        .equalTo(user.uid)
        .once('value')

    if (!snapshot) {
        //Review ErrorResponse statusCode, 418 means "I'm a teapot!"
        throw new ErrorResponse(418, 'Could not get all pocks')
    }

    const result: PockMessage[] = []
    snapshot.forEach((s: admin.database.DataSnapshot) => {
        result.push(new PockMessage(Object.assign({}, s.val(), {id: s.key})))
    })

    return result.sort((a: PockMessage, b: PockMessage) => a.dateInserted - b.dateInserted)
}
