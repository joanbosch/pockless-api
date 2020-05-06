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

    //Step 1: Take an Snapshot of the achievements of an user
    const AllTheAchievmentsOfAnUser = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
        .orderByChild('userId')
        .equalTo(user.uid)
        .once('value')

    //Step2: Get All AchievementsId of the user
    const allAchivementsIdOfAnUser: String[] = []
    AllTheAchievmentsOfAnUser.forEach((s: admin.database.DataSnapshot) => {
                allAchivementsIdOfAnUser.push(s.val().achievementId)
            })

    //Step3: Get all the Achievements
    const allAchievmentsOfAnUser: Achievements[] =[]
    for (let i in allAchivementsIdOfAnUser) {
        const snapshotOfTheAchievements = await admin.database().ref(ACHIEVEMENTS_REF)
            .orderByChild('achievementId')
            .equalTo(i)
            .once('value')
        //we will only have 1 achievemnt in each snapshot
        snapshotOfTheAchievements.forEach((ss: admin.database.DataSnapshot) => {
            allAchievmentsOfAnUser.push(ss.val())
        })
    }
    //Step 4: Return all Achievements
    return allAchievmentsOfAnUser
}

