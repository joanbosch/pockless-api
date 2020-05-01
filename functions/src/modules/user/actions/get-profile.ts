import admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { MESSAGES_REF, PROFILE_REF } from "../../../common/paths";
import { UserProfile } from "../model/user-profile";

/**
 * Return the user associated with the token
 * @param user
 */
export default async (user: any): Promise<UserProfile> => {
    const userSnapshot = await admin.database().ref(`${PROFILE_REF}/${user.uid}`).once('value')

    if (userSnapshot === null || userSnapshot.val() === null) {
        throw new ErrorResponse(404, "User not found")
    }

    const pocks = await admin.database().ref(`${MESSAGES_REF}`).orderByChild('user').equalTo(user.uid).once('value')

    return new UserProfile(Object.assign({}, userSnapshot.val(), {pocks: Object.keys(pocks.val()).length}))
}
