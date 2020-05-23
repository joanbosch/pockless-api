//New Achivement achieved function
import admin from "firebase-admin";
import { now } from "moment";
import {ACHIEVEMENTS_REF, OWNED_ACHIEVEMENTS_REF} from "../../../common/paths";
import { Category, sendMessage } from "../../messaging/actions/send-message";
import { Message } from "../../messaging/models/message"
import { composeKey } from "../../pocks/actions/like-pock";
import { ALL_NORMAL_ACHIEVEMENTS, EASTER_EGG_6, EASTER_EGGS } from "../achivements";

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

        const actualAchievement = await admin.database().ref(`${ACHIEVEMENTS_REF}/${achId}`).once('value')
        //Send new achivement notification
        const notification: Message = {
            title: '¡Nuevo logro conseguido!',
            content: actualAchievement.val().name,
            type: Category.ACHIEVEMENT
        }
        await sendMessage(usId, notification)

        //Achievement check
        const allMyAchievements = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
            .orderByChild("userId")
            .equalTo(usId)
            .once('value')

        if (allMyAchievements.val() != null && Object.keys(allMyAchievements.val()).length == 14) {
            await userGetNewAchievement(usId, EASTER_EGG_6)
        }

        const normalAchievements = Object.values(allMyAchievements.val()).filter((a: any) => !EASTER_EGGS.includes(a.achievementId))

        if (normalAchievements.length == 10) await userGetNewAchievement(usId, ALL_NORMAL_ACHIEVEMENTS)
    }
}
