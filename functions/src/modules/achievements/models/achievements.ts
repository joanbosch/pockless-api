import * as admin from "firebase-admin";
import {OWNED_ACHIEVEMENTS_REF} from "../../../common/paths";

export class Achievements {
    achievementId: string;
    achievementName: string;
    description: string;
    achievementIcon: string;

    constructor(theId: string, theName: string, theDescription: string, theIcon: string) {
        this.achievementId = theId;
        this.achievementName = theName;
        this.description = theDescription;
        this.achievementIcon = theIcon
    }
}





