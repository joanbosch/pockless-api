import {Message} from "../models/message";
import * as admin from "firebase-admin";
import {LIKES_REF, MESSAGES_REF, NOTIFICATIONS_REF} from "../../../common/paths";
import {ErrorResponse} from "../../../common/error";
import {NotificationMessage} from "../models/message-output";

export default async (id : string , {uid} : any) : Promise<Message> => {

    const db = await admin.database().ref(`${MESSAGES_REF}/${id}`).once('value')

    //We throw an error if we haven't got any notification from DB
    if (db == null || db.val() == null) {
        throw new ErrorResponse(404, `Could not get the pock with id ${id}`)
    }

    const notificationSnapshot =  await admin.database().ref(`${NOTIFICATIONS_REF}`)
        .orderByChild("userId")
        .equalTo(id)
        .once('value')

    const notifications = notificationSnapshot.val() != null ? Object.keys(notificationSnapshot.val()).length : 0

    return new NotificationMessage(Object.assign(
        {},
        db.val(),
        {id: id, title:}
    ))
}