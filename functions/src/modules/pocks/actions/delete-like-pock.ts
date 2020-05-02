import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error/index";
import { LIKES_REF } from "../../../common/paths";
import { PockMessage } from "../models/pock-message";
import getPock from "./get-pock";
import { composeKey } from "./like-pock";

export default async (pockId: string, user: any): Promise<PockMessage> => {
    const like = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("composedKey")
        .equalTo(composeKey(pockId, user.uid))
        .once('value')

    if (like.val() == null) {
        throw new ErrorResponse(403, 'Undo like is not allowed', `User ${user.uid} has not liked pock ${pockId}`)
    }

    const id = Object.keys(like.val())[0]
    await admin.database().ref(`${LIKES_REF}/${id}`).remove()

    return getPock(pockId, user)
}
