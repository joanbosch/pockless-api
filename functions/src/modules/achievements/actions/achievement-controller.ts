//New Achivement achieved function
import admin from "firebase-admin";
import {OWNED_ACHIEVEMENTS_REF} from "../../../common/paths";
import {now} from "moment";

export const userGetNewAchievement = async (usId: string, achId: string) => {
    admin.database().ref(OWNED_ACHIEVEMENTS_REF).push({
        achievementId: achId,
        userId: usId,
        dateOfAcquitance: now
    })
}