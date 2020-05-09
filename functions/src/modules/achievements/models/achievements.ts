import * as admin from "firebase-admin";
import {OWNED_ACHIEVEMENTS_REF} from "../../../common/paths";

export class Achievements {
    // @ts-ignore
    constructor({achievementId, achievementName, description, achievementIcon}) {
        this.achievementId = achievementId;
        this.achievementName = achievementName;
        this.description = description;
        this.achievementIcon = achievementIcon;
    }
    achievementId: string
    achievementName: string
    description: string
    achievementIcon: string
}





