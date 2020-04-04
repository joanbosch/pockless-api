import { UserProfile } from "@/modules/user/model/user-profile";
import admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { CreateUserRestInput, validateCreateUserRestInput } from "../model/create-user-rest-input";
import getUserExists from "./get-user-exists";

const PROFILE_REF = '/profile'

export default async (body: CreateUserRestInput): Promise<UserProfile> => {
    if (!validateCreateUserRestInput(body)) {
        throw new ErrorResponse(400, 'Some of the fields are not correct.')
    }

    if (await getUserExists(body.id)) {
        throw new ErrorResponse(403, `User ${body.id} already exists.`)
    }

    await admin.database().ref(`${PROFILE_REF}/${body.id}`).set(body)

    const user = await admin.database().ref(`${PROFILE_REF}/${body.id}`).once('value')

    return user.val() as UserProfile
}
