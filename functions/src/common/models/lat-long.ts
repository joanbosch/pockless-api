import { an, is, namedSchema } from "yup-decorator";
import { Validator } from "./validator";

/**
 * Latitude-Longitude type
 */
@namedSchema(LatLong.name)
export class LatLong extends Validator {

    // @ts-ignore
    constructor({latitude, longitude}) {
        super()
        this.latitude = latitude
        this.longitude = longitude
    }

    @is(an.number().required().min(-90).max(90))
    latitude: number

    @is(an.number().required().min(-180).max(180))
    longitude: number
}

