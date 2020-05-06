//New Achivement achieved function
import admin from "firebase-admin";
import {OWNED_ACHIEVEMENTS_REF} from "../../../common/paths";
import {now} from "moment";
import {composeKey} from "../../pocks/actions/like-pock";
import {EASTER_EGG_1, EASTER_EGG_6} from "../achivements";

export const userGetNewAchievement = async (usId: string, achId: string) => {
    // Step 1: check if the user has or not the acievement
    const checkAchievement = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
        .orderByChild("composedKey")
        .equalTo(composeKey(usId, achId))
        .once('value')

    //Step 2: if not, add it
    if (checkAchievement.val() == null) {
        admin.database().ref(OWNED_ACHIEVEMENTS_REF).push({
            achievementId: achId,
            userId: usId,
            dateOfAcquitance: now
        })
    }

    //Achivement check

    const allMyAchievements = await admin.database().ref(OWNED_ACHIEVEMENTS_REF)
        .orderByChild("user")
        .equalTo(usId)
        .once('value')

    if (Object.keys(allMyAchievements.val()).length == 21) userGetNewAchievement(usId, EASTER_EGG_6)
}