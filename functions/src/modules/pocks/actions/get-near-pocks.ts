import * as admin from "firebase-admin";
import { now } from "moment";
import { LatLong } from "../../../common/models/lat-long";
import { MESSAGES_REF, PROFILE_REF } from "../../../common/paths";
import { getNearIds } from "../../geolocation/actions/get-near-ids"
import { UserProfile } from "../../user/model/user-profile";
import { PockMessage } from "../models/pock-message"

const RADIUS_POCKS: number = 1 // 1 kilometer

/**
 * Returns all the pocks near to the given location
 */
export default async (input: LatLong, user: any): Promise<PockMessage[]> => {
    // Step 1: Obtain user radius of visibility
    const userProfileSnapshot = await admin.database().ref(`${PROFILE_REF}/${user.uid}`).once('value')

    let radius = RADIUS_POCKS
    let profile: UserProfile | null = null

    if (userProfileSnapshot != null && userProfileSnapshot.val() != null) {
        profile = new UserProfile(userProfileSnapshot.val())
        radius = profile.radiusVisibility
    }

    // Step 2: Obtain ids of pocks near to the input location
    const nearIds = await getNearIds(input, radius)

    // Step 3: Find the pocks corresponding to the obtained ids and add them to the 'returnPocksList' array
    const returnPocksList: PockMessage[] = []

    const filterSensiblePocks = profile != null && !profile.isOlderThan18()

    for (const pockId of nearIds) { //if using forEach and async it doesn't return any pock
        const onePock = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).once('value')

        // If database returned nothing, means that it has expired
        if (onePock != null && onePock.val() !== null && onePock.val().dateExpiration >= now()) {
            if (!filterSensiblePocks || onePock.val().category !== '+18' && !onePock.val().hidden) {
                returnPocksList.push(new PockMessage(Object.assign({}, onePock.val(), {id: pockId})))
            }
        }
    }

    return returnPocksList
}
