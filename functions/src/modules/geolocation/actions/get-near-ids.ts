import { LatLong } from "../../../common/models/lat-long";
import * as admin from "firebase-admin";
import * as geofire from "geofire";

const MESSAGES_LOC_REF = '/messages-locations'

/**
 * Obtains the id of any pock inside the radius of a location.
 */
export const getNearIds = async (location: LatLong, radius: number): Promise<string[]> =>
    new Promise((resolve, reject) => {
        // @ts-ignore
        const gf = new geofire.GeoFire(admin.database().ref(MESSAGES_LOC_REF))
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