import admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { PROFILE_REF } from "../../../common/paths";
import { WELCOME_POCKLES } from "../../achievements/achivements";
import { userGetNewAchievement } from "../../achievements/actions/achievement-checker";
import { CreateUserRestInput, } from "../model/create-user-rest-input";
import { UserProfile } from "../model/user-profile";
import getUserExists from "./get-user-exists";

/**
 * Creates the user in the database if it does not exist
 *
 * @param body
 */
export default async (body: CreateUserRestInput): Promise<UserProfile> => {

    if (await getUserExists(body.id)) {
        throw new ErrorResponse(403, `User ${body.id} already exists.`)
    }

    await admin.database().ref(`${PROFILE_REF}/${body.id}`).set(body)

    const user = await admin.database().ref(`${PROFILE_REF}/${body.id}`).once('value')

    //Achievement Check
    await userGetNewAchievement(body.id, WELCOME_POCKLES)
    //End Achievement Check

    return new UserProfile(user.val())
}
