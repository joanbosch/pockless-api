import { LatLong } from "../../../common/models/lat-long";

/**
 * Type of the PockMessage
 */
export class PockMessage {
    // @ts-ignore
    constructor({id, message, location, dateInserted, user, username, url, category, chatAccess, likes, canLike}) {
        this.id = id
        this.message = message
        this.location = location
        this.dateInserted = dateInserted
        this.user = user
        this.username = username
        this.media = url
        this.category = category
        this.chatAccess = chatAccess
        this.likes = likes
        this.canLike = canLike
    }

    id: any

    message: string

    location: LatLong

    dateInserted: number

    user?: string

    username?: string

    media?: string

    category: string

    chatAccess: boolean

    canLike: boolean

    likes: number
}
