import * as admin from "firebase-admin";
import * as geofire from "geofire"
import { ErrorResponse } from "../../../common/error";
import { LatLong, validateLatLong } from "../../../common/models/lat-long";
import { PockMessage } from "../models/pock-message"

const MESSAGES_REF = '/messages'
const MESSAGES_LOC_REF = '/messages-locations'
const RADIUS_POCKS = 0.5 // 0.5 kilometers

/**
 * Returns all the pocks near to the given location.
 */
export default async (input: LatLong): Promise<PockMessage[]> => {

    // Step 1: Validate input
    if (!validateLatLong(input)) {
        throw new ErrorResponse(400, 'Some of the fields are not correct')
    }

    // Step 2: Obtain ids of pocks near to the input location
    const locations = await getLocations(input, RADIUS_POCKS)

    // Step 3: Find the pocks corresponding to the obtained ids and add them to the 'returnPocksList' array
    let returnPocksList: PockMessage[] = [];
    let i: number;
    for (i=0; i<locations.length; i++) {
        const onePock = await admin.database().ref(`${MESSAGES_REF}/${locations[i]}`).once('value')
        const {
            message,
            location,
            dateInserted,
            mediaUrl,
            category,
            chatAccess
        } = onePock.val()

        returnPocksList.push({
            id: locations[i],
            message,
            location,
            dateInserted,
            category,
            chatAccess: !!chatAccess ? chatAccess : false,
            media: mediaUrl,
            user: '0'
        });
    }

    return returnPocksList
}

/**
 * Obtains the id of any pock inside the radius of a location.
 */
const getLocations = async (location: LatLong, radius: number): Promise<string[]> =>
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