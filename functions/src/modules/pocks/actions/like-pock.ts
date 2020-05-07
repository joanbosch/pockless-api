import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error/index";
import { LIKES_REF } from "../../../common/paths";
import { HUNDRED_LIKES, TEN_LIKES } from "../../achievements/achivements";
import { userGetNewAchievement } from "../../achievements/actions/achievement-checker";
import { PockMessage } from "../models/pock-message";
import getPock from "./get-pock"

export default async (pockId: string, user: any): Promise<PockMessage> => {
    const like = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("composedKey")
        .equalTo(composeKey(pockId, user.uid))
        .once('value')

    if (like.val() != null) {
        throw new ErrorResponse(403, 'Like is not allowed', `User ${user.uid} has already liked pock ${pockId}`)
    }

    await admin.database().ref(`${LIKES_REF}`).push({
        composedKey: composeKey(pockId, user.uid),
        user: user.uid,
        pock: pockId
    })

    const likesSnapshot = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("user")
        .equalTo(user.uid)
        .once('value')

    //Achievement check
    const likesCounter = likesSnapshot == null ? 0 : Object.keys(likesSnapshot.val()).length
    if (likesCounter == 10) await userGetNewAchievement(user.uid, TEN_LIKES)
    if (likesCounter == 100) await userGetNewAchievement(user.uid, HUNDRED_LIKES)
    //End Achievement check

    return getPock(pockId, user)
}

export const composeKey = (key: string, uid: string) => {
    return `${key}_${uid}`
}
