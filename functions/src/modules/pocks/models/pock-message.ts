import { LatLong } from "../../../common/models/lat-long";

/**
 * Type of the PockMessage
 *
 * It has no validator as it is an outgoing object (database -> external device).
 */
export type PockMessage = {
    id: any

    message: string

    location: LatLong

    dateInserted: number

    dateModified?: number

    user?: string

    media?: string
}
