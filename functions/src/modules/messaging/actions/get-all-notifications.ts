import {Message} from "../models/message";
import * as admin from "firebase-admin";
import {NOTIFICATIONS_REF} from "../../../common/paths";
import getNotification from "../../messaging/actions/get-message";

export default async ({uid}: any): Promise<Message[]> => {

    const notificationsSnapshot = await admin.database().ref(`${NOTIFICATIONS_REF}`)
        .orderByChild("userId")
        .equalTo(uid)
        .once('value')

    const val = notificationsSnapshot.val()
    if (val == null || val.length == 0) {
        return []
    }

    return Promise.all(Object.values(val).map(async (notifaction: any) => {
        return await getNotification(notifaction.id, {uid})
    }))


}