import admin from "firebase-admin";

const PROFILE_REF = '/profile'

export default async (id: string) => {

    const snapshot = await admin.database().ref(`${PROFILE_REF}/${id}`).once('value')

    return snapshot.val() !== null
}
