import { an, is, namedSchema } from "yup-decorator";

/**
 * Latitude-Longitude type
 */
@namedSchema(LatLong.name)
export class LatLong {

    // @ts-ignore
    constructor({latitude, longitude}) {
        this.latitude = latitude
        this.longitude = longitude
    }

    @is(an.number().required().min(-90).max(90))
    latitude: number

    @is(an.number().required().min(-180).max(180))
    longitude: number
}

