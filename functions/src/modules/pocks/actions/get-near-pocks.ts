import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { LatLong, validateLatLong } from "../../../common/models/lat-long";
import { PockMessage } from "../models/pock-message"
import { getNearIds } from "../../geolocation/actions/get-near-ids"

const MESSAGES_REF = '/messages'
const RADIUS_POCKS: number = 0.5 // 0.5 kilometers

/**
 * Returns all the pocks near to the given location.
 */
export default async (latitude: number, longitude: number): Promise<PockMessage[]> => {
    let input: LatLong = {
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
    let returnPocksList: PockMessage[] = [];
    for (const pockId of nearIds) { //if using forEach and async it doesn't return any pock
        const onePock = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).orderByChild('dateExpiration').endAt(Date.now()).once('value')
        // If database returned nothing, means that it has expired
        if (onePock != null) {
            const {
                message,
                location,
                dateInserted,
                mediaUrl,
                category,
                chatAccess
            } = onePock.val()

            returnPocksList.push({
                id: pockId,
                message,
                location,
                dateInserted,
                category,
                chatAccess: !!chatAccess ? chatAccess : false,
                media: mediaUrl,
                user: '0'
            });
        }
    }

    return returnPocksList
}