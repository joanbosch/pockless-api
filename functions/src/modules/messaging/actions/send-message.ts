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

    if (!!token.val()){
        admin.messaging().sendToDevice('cXoZYLk2e1w:APA91bEOLBozhnBhDz06YzdquiArXRK9IVZufmytAaWL665MSls3tl0vhRmKn5oMRQ6piIa535YGjXAxrFSt_lTF4C0rAUDUq0V_kubAstcHflOsikLzc2twdkfyNaXT3s0I9sMdDKLA', {
            data: {
                body: message.content,
                title: message.title,
                category: message.type.toString(),
                ...message.extra
            }
        })

    }

}