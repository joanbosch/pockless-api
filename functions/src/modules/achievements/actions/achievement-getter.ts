import * as admin from "firebase-admin";
import { ACHIEVEMENTS_REF, OWNED_ACHIEVEMENTS_REF } from "../../../common/paths";
import { Achievement } from "../models/achievement";

/**
 * Return the user associated with the token
 * @param user
 */

export default async (user: any): Promise<Achievement[]> => {

    //Step 1: Take an Snapshot of the achievements of an user
    const allTheAchievementsOfAnUser = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
        .orderByChild('userId')
        .equalTo(user.uid)
        .once('value')

    //Step2: Get All AchievementsId of the user
    const allAchievementsIdOfAnUser: String[] = []
    allTheAchievementsOfAnUser.forEach((s: admin.database.DataSnapshot) => {
        allAchievementsIdOfAnUser.push(s.val().achievementId)
    })

    return Promise.all(allAchievementsIdOfAnUser.map(async id => {
        const snapshotOfTheAchievements = await admin.database().ref(`${ACHIEVEMENTS_REF}/${id}`).once('value')
        //we will only have 1 achievement in each snapshot
        return new Achievement(Object.assign({}, snapshotOfTheAchievements.val(), {id: snapshotOfTheAchievements.key}))
    }))
}

