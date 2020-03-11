import { CreatePockRestInput } from "../models/create-pock-rest-input";
import { PockMessage } from "../models/pock-message";
import * as admin from "firebase-admin";
import { ApiResponse } from "../../../common/response";

export default async (input: CreatePockRestInput): Promise<PockMessage> => {

    const snapshot = await admin.database().ref('/messages')
        .push({ dateInserted: Date.now(), ...input })

    if ( !snapshot ) {
        throw new Error('Could not insert the pock')
    }

    const ref = snapshot.ref.toString().split('/')
    const id = ref[ref.length - 1]


    const {
        message,
        location,
        dateInserted
    } = (await admin.database().ref(`/messages/${id}`).once('value')).val()

    return {
        id,
        message,
        location,
        dateInserted,
        user: '0'
    }
}
