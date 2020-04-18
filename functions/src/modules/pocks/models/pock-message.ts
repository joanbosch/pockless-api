import { LatLong } from "../../../common/models/lat-long";

/**
 * Type of the PockMessage
 *
 * It has no validator as it is an outgoing object (database -> external device).
 */
export class PockMessage {
    static POCK_LOCATION = [];
    // @ts-ignore
    constructor({id, message, location, dateInserted, user, username, media, category, chatAccess}) {
        this.id = id
        this.message = message
        this.location = location
        this.dateInserted = dateInserted
        this.user = user
        this.username = username
        this.media = media
        this.category = category
        this.chatAccess = chatAccess
        // @ts-ignore
        PockMessage.POCK_LOCATION.push(location);
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

    static getAllLocations() {
        return PockMessage.POCK_LOCATION.slice(); //devolvemos una copia, para evitar que alguien pueda modificar el original
    }
}
