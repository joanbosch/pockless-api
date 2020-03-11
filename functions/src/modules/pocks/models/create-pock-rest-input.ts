import { LatLong } from "../../../common/models/lat-long";

export interface CreatePockRestInput {
    message: string

    location: LatLong

    chatAccess: boolean

    category: string
}
