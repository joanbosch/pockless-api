/**
 * Return the user associated with the token
 * @param user
 */
import admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { UserProfile } from "../model/user-profile";

const PROFILE_REF = '/profile'

export default async (user: any): Promise<UserProfile> => {
    const userSnapshot = await admin.database().ref(`${PROFILE_REF}/${user.uid}`).once('value')

    if (userSnapshot === null || userSnapshot.val() === null) {
        throw new ErrorResponse(404, "User not found")
    }
    return userSnapshot.val() as UserProfile
}
