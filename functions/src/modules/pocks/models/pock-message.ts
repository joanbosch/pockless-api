import { LatLong } from "../../../common/models/lat-long";

export type PockMessage = {
    id: any

    message: string

    location: LatLong

    dateInserted: number

    dateModified?: number

    user?: string
}
