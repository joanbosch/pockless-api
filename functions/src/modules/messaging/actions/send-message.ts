import * as admin from "firebase-admin"
import {Message} from "../models/message";

export enum Category {
    CHAT,
    TRENDING,
    REPORTS,
    ACHIEVEMENT,
    BAN,
}

export const sendMessage = async (receiverId: string, message: Message) => {



    admin.messaging().sendToDevice()
    {

    }

}