//New Achivement achieved function
import admin from "firebase-admin";
import { now } from "moment";
import { OWNED_ACHIEVEMENTS_REF } from "../../../common/paths";
import { composeKey } from "../../pocks/actions/like-pock";
import { EASTER_EGG_6 } from "../achivements";

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
            .orderByChild("user")
            .equalTo(usId)
            .once('value')

        if (allMyAchievements.val() != null && Object.keys(allMyAchievements.val()).length == 21) {
            await userGetNewAchievement(usId, EASTER_EGG_6)
        }
    }
}
