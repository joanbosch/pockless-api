import * as admin from "firebase-admin";
import {ErrorResponse} from "../../../common/error/index";
import {LIKES_REF, MESSAGES_REF, REPORTS_REF} from "../../../common/paths";
import {PockMessage} from "../models/pock-message";
import getPock from "./get-pock"
import {Category, sendMessage} from "../../messaging/actions/send-message";
import {Message} from "../../messaging/models/message";
import {composeKey} from "./like-pock";
import {ReportPockRestInput} from "../models/report-pock-rest-input";

export default async (pockId: string, input: ReportPockRestInput, user: any): Promise<PockMessage> => {
    //Has the pock been reported?
    const pockReport = await admin.database().ref(`${REPORTS_REF}`)
        .orderByChild("composeKeyReport")
        .equalTo(composeKeyReport(pockId, user.uid))
        .once('value')

    if (pockReport.val() != null) {
        throw new ErrorResponse(403, 'REPORT FORBIDDEN', `User ${user.uid} has already reported pock ${pockId}`)
    }


    //Has the pock reached the max number of reports?
    //obtain the n of reports of the pock
    const numPockReported = await admin.database().ref(`${REPORTS_REF}`)
        .orderByChild("pock")
        .equalTo(pockId)
        .once('value')
    //obtain the n of likes of the pock
    const likesSnapshot = await admin.database().ref(`${LIKES_REF}`)
        .orderByChild("pock")
        .equalTo(pockId)
        .once('value')

    const likes = likesSnapshot.val() != null ? Object.keys(likesSnapshot.val()).length : 0 //nlikes
    const reports = pockReport.val() != null ? Object.keys(numPockReported.val()).length + 1 : 1//nReports
    /*
         If the ratio between likes and reports is higher than 50%, the pock is hidden if it has a minimum of 50 reports.
     */
    if (reports >= 50 && (reports / likes) > 0.5) {
        //update the pock indicating it has been hidden
        await admin.database().ref(`${MESSAGES_REF}/${pockId}`).update({
            hidden: true
        })


        //Now we have to notify the creator
        const snapshot = await admin.database().ref(`${MESSAGES_REF}/${pockId}`).once('value')
        if (snapshot == null || snapshot.val() == null) {
            throw new ErrorResponse(404, 'Could not find this pock')
        }
        const creator = snapshot.val().user
        const noti: Message = {
            title: `Your Pock has been deleted`,
            content: 'Your Pock about "' + snapshot.val().category + '" has been hidden from our app due a high number of user reports',
            type: Category.REPORTS
        }
        await sendMessage(creator, noti)
    }
    //Add the report to the db
    await admin.database().ref(`${REPORTS_REF}`).push({
        composeKeyReport: composeKeyReport(pockId, user.uid),
        user: user.uid,
        pock: pockId,
        motive: input.motive
    })

    return getPock(pockId, user)
}

export const composeKeyReport = (key: string, uid: string) => {
    return `${key}_${uid}`
}
