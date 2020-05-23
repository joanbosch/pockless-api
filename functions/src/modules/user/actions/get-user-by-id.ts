import admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { MESSAGES_REF, PROFILE_REF } from "../../../common/paths";
import { ViewOtherUser } from "../model/view-other-user";

/**
 * Get a user from the database with a specific id
 * Badge update is needed
 */
export default async (userId: string): Promise<ViewOtherUser> => {
    //Check if exists a profile with the given id
    const userSnapshot = await admin.database().ref(`${PROFILE_REF}/${userId}`).once('value')
    if (userSnapshot === null || userSnapshot.val() === null) {
        throw new ErrorResponse(404, "User not found")
    }

    const pocks = await admin.database().ref(`${MESSAGES_REF}`).orderByChild('user').equalTo(userId).once('value')

    const numberOfPocks = pocks.val() != null ? Object.keys(pocks.val()).length : 0
    //Code to update
    const numberOfBadge = 0;

    return new ViewOtherUser(Object.assign({}, userSnapshot.val(), {pocks: numberOfPocks}, {badge: numberOfBadge}))
}