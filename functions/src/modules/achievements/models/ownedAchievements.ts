/**
 * Type of the Achievements
 */
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