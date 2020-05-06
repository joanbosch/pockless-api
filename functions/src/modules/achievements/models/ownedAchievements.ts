/**
 * Type of the Achievements
 */
import {OWNED_ACHIEVEMENTS_REF} from "../../../common/paths";
import admin from "firebase-admin";
import {now} from "moment";

export class OwnedAchievements {
    // @ts-ignore
    constructor({achievementId, userId, dateOfAcquitance}) {
        this.achievementId = achievementId;
        this.userId = userId;
        this.dateOfAcquitance = dateOfAcquitance;
    }

    achievementId: string
    userId: string
    dateOfAcquitance: number
}


