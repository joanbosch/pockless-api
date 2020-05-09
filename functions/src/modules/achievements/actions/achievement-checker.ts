//New Achivement achieved function
import admin from "firebase-admin";
import { now } from "moment";
import {ACHIEVEMENTS_REF, CHAT_MESSAGES_REF, CHATS_REF, OWNED_ACHIEVEMENTS_REF} from "../../../common/paths";
import { composeKey } from "../../pocks/actions/like-pock";
import {ALL_NORMAL_ACHIEVEMENTS, EASTER_EGG_6} from "../achivements";
import {Achievements} from "../models/achievements";

export const userGetNewAchievement = async (usId: string, achId: string) => {
    // Step 1: check if the user has or not the achievement
    const checkAchievement = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
        .orderByChild("composedKey")
        .equalTo(composeKey(usId, achId))
        .once('value')

    //Step 2: if not, add it
    if (checkAchievement.val() == null) {
        await admin.database().ref(OWNED_ACHIEVEMENTS_REF).push({
            achievementId: achId,
            userId: usId,
            composedKey: composeKey(usId, achId),
            dateOfAcquaintance: now()
        })


        //Achievement check
        const allMyAchievements = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
            .orderByChild("userId")
            .equalTo(usId)
            .once('value')

        if (allMyAchievements.val() != null && Object.keys(allMyAchievements.val()).length == 3) {
            await userGetNewAchievement(usId, EASTER_EGG_6)
        }

        ///////////////////////////////
        const allAchId : string[] = []
        allMyAchievements.forEach((ach: admin.database.DataSnapshot) => {
            allAchId.push(ach.val().achievementId)
        })
        const allAch: Achievements[] = []
        for (let i = 0; i < allAchId.length; ++i) {
            const id = allAchId[i]
            const a = await admin.database().ref(`${ACHIEVEMENTS_REF}/${id}`).once('value')
                allAch.push(a.val())
        }
        let easterEggCounter = 0
        for (let i = 0; i < allAch.length; ++i){
            if (allAch[i].achievementName == 'Secreto') ++easterEggCounter
        }
        if (allAch.length - easterEggCounter == 3) await userGetNewAchievement(usId, ALL_NORMAL_ACHIEVEMENTS)
    }
}
