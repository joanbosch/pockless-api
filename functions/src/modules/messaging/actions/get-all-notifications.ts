import * as admin from "firebase-admin";
import { NOTIFICATIONS_REF } from "../../../common/paths";
import { NotificationMessage } from "../models/message-output";

export default async ({uid}: any): Promise<NotificationMessage[]> => {

    const notificationsSnapshot = await admin.database().ref(`${NOTIFICATIONS_REF}`)
        .orderByChild("userId")
        .equalTo(uid)
        .once('value')

    const val = notificationsSnapshot.val()
    if (val == null || val.length == 0) {
        return []
    }

    return Promise.all(Object.values(val).map(async (notification: any) => {
        return new NotificationMessage(notification)
    }))

}
