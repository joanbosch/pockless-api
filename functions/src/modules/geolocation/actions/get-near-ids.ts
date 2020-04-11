import * as admin from "firebase-admin";
import * as geofire from "geofire";
import { LatLong } from "../../../common/models/lat-long";
import { MESSAGES_LOCATIONS_REF } from "../../../common/paths";

/**
 * Obtains the id of any pock inside the radius of a location.
 */
export const getNearIds = async (location: LatLong, radius: number): Promise<string[]> =>
    new Promise((resolve, reject) => {
        // @ts-ignore
        const gf = new geofire.GeoFire(admin.database().ref(MESSAGES_LOCATIONS_REF))
        const locations: string[] = []
        const geoQuery = gf.query({
            center: [
                location.latitude,
                location.longitude
            ],
            radius: radius
        })

        const keyEntered = geoQuery.on("key_entered", (key: string) =>
            locations.push(key))

        geoQuery.on('ready', () => {
            keyEntered.cancel()
            resolve(locations)
        })
    })
