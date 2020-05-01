import * as admin from "firebase-admin"
import {Message} from "../models/message";
import {PROFILE_REF} from "../../../common/paths";

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
        admin.messaging().sendToDevice(token.val(), {
            data: {
                body: message.content,
                title: message.title,
                category: message.type.toString(),
                ...message.extra
            }
        })
    }
}