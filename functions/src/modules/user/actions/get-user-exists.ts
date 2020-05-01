import admin from "firebase-admin";
import { PROFILE_REF } from "../../../common/paths";

/**
 * Returns if a user exists on the database
 * @param id
 */
export default async (id: string): Promise<Boolean> => {

    const snapshot = await admin.database().ref(`${PROFILE_REF}/${id}`).once('value')

    return snapshot.val() !== null
}
