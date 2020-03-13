import { LatLong, validateLatLong } from "../../../common/models/lat-long"
import { ErrorResponse } from "../../../common/error"
import * as geofire from "geofire"
import * as admin from "firebase-admin"

const MESSAGES_LOCATIONS_REF = '/messages-locations'

/**
 * Adds the given location to the id into the specific {@link #MESSAGES_LOCATIONS_REF}
 * path.
 *
 * @param location  {@link LatLong} to insert
 * @param objectId  id of the object
 */
export default async (location: LatLong, objectId: string) => {
    if ( !validateLatLong(location) ) {
        throw new ErrorResponse(404, 'LarLong is not valid')
    }

    const {
        latitude,
        longitude
    } = location

    // @ts-ignore
    const gf = new geofire.GeoFire(admin.database().ref(MESSAGES_LOCATIONS_REF))

    try {
        // lack of response means the promise has been fulfilled, therefore it has been correctly inserted
        return !(await gf.set(objectId, [ latitude, longitude ]))
    } catch (e) {
        return false
    }

}
