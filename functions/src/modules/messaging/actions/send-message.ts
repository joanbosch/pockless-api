import * as admin from "firebase-admin"
import { NOTIFICATIONS_REF, PROFILE_REF } from "../../../common/paths";
import { Message } from "../models/message";

export enum Category {
    CHAT,
    TRENDING,
    REPORTS,
    ACHIEVEMENT,
    BAN,
}

export const sendMessage = async (receiverId: string, message: Message) => {

    const token = await admin.database().ref(`${PROFILE_REF}/${receiverId}/token`).once('value')

    if (!!token.val()) {
        if(message.type !== Category.CHAT){
            admin.database().ref(NOTIFICATIONS_REF).push({
                userId : receiverId,
                ...message
                }
            )
        }

        await admin.messaging().sendToDevice(token.val(), {
            data: {
                body: message.content,
                title: message.title,
                category: message.type.toString(),
                ...message.extra
            }
        })
    }
}
