import {InsertTokenRestInput} from "../../user/model/insert-token-rest-input";
import * as admin from "firebase-admin";

export default async (body: InsertTokenRestInput, user: any) => {

    await admin.database().ref(`profile/${user.uid}/token`).set(
        body.token
    )

    return true
}