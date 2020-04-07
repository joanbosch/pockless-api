import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { LatLong, validateLatLong } from "../../../common/models/lat-long";
import { getNearIds } from "../../geolocation/actions/get-near-ids"
import { PockMessage } from "../models/pock-message"

const MESSAGES_REF = '/messages'
const RADIUS_POCKS: number = 50 // 0.5 kilometers

/**
 * Returns all the pocks near to the given location.
 */
export default async (latitude: number, longitude: number): Promise<PockMessage[]> => {
    const input: LatLong = {
        latitude,
        longitude
    }

    // Step 1: Validate input
    if (!validateLatLong(input)) {
        throw new ErrorResponse(400, 'Some of the fields are not correct')
    }

    // Step 2: Obtain ids of pocks near to the input location
    const nearIds = await getNearIds(input, RADIUS_POCKS)

    // Step 3: Find the pocks corresponding to the obtained ids and add them to the 'returnPocksList' array
    const returnPocksList: PockMessage[] = [];
    for (const pockId of nearIds) { //if using forEach and async it doesn't return any pock
        const onePock = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).orderByChild('dateExpiration').endAt(Date.now()).once('value')
        // If database returned nothing, means that it has expired
        if (onePock !== null) {
            returnPocksList.push(Object.assign({}, onePock.val(), {id: pockId}))
        }
    }

    return returnPocksList
}
