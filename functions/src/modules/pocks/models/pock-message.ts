import { now } from "moment";
import {LatLong} from "../../../common/models/lat-long";

/**
 * Type of the PockMessage
 */
export class PockMessage {
    // @ts-ignore
    constructor({id, message, location, dateInserted, user, username, media, category, chatAccess, likes, liked, userProfileImage, reports, reported, hidden}) {
        this.id = id
        this.message = message
        this.location = location
        this.dateInserted = dateInserted
        this.user = user
        this.username = username
        this.media = media
        this.category = category
        this.chatAccess = chatAccess
        this.likes = likes
        this.liked = liked
        this.userProfileImage = userProfileImage
        this.reports = reports
        this.reported = reported
        this.hidden = hidden
        this.editable = now() < this.dateInserted + 20*60*1000 // 20 minutes
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

    liked: boolean

    likes: number

    userProfileImage: string

    reports: number

    reported: boolean

    hidden: boolean

    editable: boolean
}
