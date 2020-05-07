import {InsertTokenRestInput} from "../../user/model/insert-token-rest-input";
import * as admin from "firebase-admin";
import {PROFILE_REF} from "../../../common/paths";

export default async (body: InsertTokenRestInput, user: any) => {

    await admin.database().ref(`${PROFILE_REF}/${user.uid}/token`).set(
        body.token
    )

    return true
}