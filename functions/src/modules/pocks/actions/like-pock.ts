import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error/index";
import { LIKES_REF } from "../../../common/paths";
import { PockMessage } from "../models/pock-message";
import getPock from "./get-pock"
import {a} from "yup-decorator";
import {userGetNewAchievement} from "../../achievements/actions/achievement-checker";
import {EASTER_EGG_1, HUNDRED_LIKES, TEN_LIKES} from "../../achievements/achivements";

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

    //Achievement check
    const likesCounter: number = Object.keys(like.val()).length + 1
    if (likesCounter == 10) userGetNewAchievement(user.uid, TEN_LIKES)
    if (likesCounter == 100) userGetNewAchievement(user.uid, HUNDRED_LIKES)
    //End Achievement check

    return getPock(pockId, user)
}

export const composeKey = (key: string, uid: string) => {
    return `${key}_${uid}`
}
