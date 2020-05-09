import { UserProfileNameImage } from "../../user/model/user-profile-name-image";

/**
 * Type of the Chat.
 *
 * It has no validator as it is an outgoing object (database -> external device).
 */
export class Chat {
    // @ts-ignore
    constructor({id, user1, user2, pock, lastMessage, date}) {
        this.id = id
        this.user1 = user1
        this.user2 = user2
        this.pock = pock
        this.lastMessage = lastMessage
        this.date = date
    }

    id: string

    user1: string

    user2: UserProfileNameImage

    pock: string

    // last message info
    lastMessage: string

    date: number
}