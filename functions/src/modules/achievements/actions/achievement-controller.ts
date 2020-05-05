import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import {ACHIEVEMENTS_REF, OWNED_ACHIEVEMENTS_REF, PROFILE_REF} from "../../../common/paths";
import { OwnedAchievements } from "../models/ownedAchievements";
import {LatLong} from "../../../common/models/lat-long";
import {now} from "moment";
import {Achievements} from "../models/achievements";

/**
 * Return the user associated with the token
 * @param user
 */

export default async (user: any): Promise<Achievements[]> => {

    //Step 1: Take an Snapshot of the Achievments
    const snapshotOfAllAchivments = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
        .once('value')

    //Step2: Get All Achievements where userId is equal to the user given
    const allAchievmentsOfAnUser: Achievements[] = []
    snapshotOfAllAchivments.forEach((s: admin.database.DataSnapshot) => {
        if (s.val().userId == user) {
            const snapshotOfTheAchivment = admin.database().ref(`${ACHIEVEMENTS_REF}/${s.val().achievementId}`).once('value')
            snapshotOfAllAchivments.forEach((ss: admin.database.DataSnapshot) => {
                allAchievmentsOfAnUser.push(ss.val())
            })
        }

    })

    //Step 3: Return all Achievements
    return allAchievmentsOfAnUser
}