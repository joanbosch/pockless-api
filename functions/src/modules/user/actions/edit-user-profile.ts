import admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { PROFILE_REF } from "../../../common/paths";
import { EditUserProfileRestInput} from "../model/edit-user-profile-rest-input";
import { UserProfile } from "../model/user-profile";

/**
 * Edit the content of a existing profile on the database
 *
 * @param input
 * @param user
 */
export default async (input: EditUserProfileRestInput, user: any): Promise<UserProfile> => {

    //Check if exists a profile with the given id
    const userSnapshot = await admin.database().ref(`${PROFILE_REF}/${user.uid}`).once('value')
    if (userSnapshot === null || userSnapshot.val() === null) {
        throw new ErrorResponse(404, "User not found")
    }

    //Update the user profile with the new values
    await admin.database().ref(`${PROFILE_REF}/${user.uid}`).update({
    ...input
    })

    //Return the edited profile
    const editedProfile = await admin.database().ref(`${PROFILE_REF}/${user.uid}`).once('value')
    return new UserProfile(Object.assign({}, editedProfile.val(), {id: editedProfile.key}))
}