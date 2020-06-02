import * as admin from "firebase-admin";
import * as moment from "moment";
import { ErrorResponse } from "../../../common/error";
import { MESSAGES_REF } from "../../../common/paths";
import {
    EASTER_EGG_1,
    EASTER_EGG_2,
    EASTER_EGG_4,
    FIRST_POCK,
    HUNDRED_POCK,
    SAME_COORDS,
    TEN_POCK,
    THOUSAND_POCK
} from "../../achievements/achivements";
import { userGetNewAchievement } from "../../achievements/actions/achievement-checker";
import addLocation from '../../geolocation/actions/add-location'
import { CreatePockRestInput } from "../models/create-pock-rest-input"
import { PockMessage } from "../models/pock-message"

export const DEFAULT_EXPIRATION_TIME = 7 * 24 * 3600 * 1000 // 1 week

/**
 * Inserts a new pock on the database.
 *
 * Note: It could be made with a transaction instead of the 'rollback' it
 * is applying in the try-catch.
 *
 * @param input
 * @param user
 */
export default async (input: CreatePockRestInput, user: any): Promise<PockMessage> => {
    //Achievement Check
    const checkingCoords = await admin.database().ref(MESSAGES_REF)
        .orderByChild("user")
        .equalTo(user.uid)
        .once('value')

    const pockscoords: PockMessage[] = []
    checkingCoords.forEach((s: admin.database.DataSnapshot) => {
        pockscoords.push(new PockMessage(s.val()))
    })

    if (pockscoords.some(p => p.location.latitude === input.location.latitude
        && p.location.longitude === input.location.longitude) != null) {
        await userGetNewAchievement(user.uid, SAME_COORDS)
    }
    //End Achievement Check

    // Step 2: Insert into database
    const snapshot =
        await admin.database().ref(MESSAGES_REF).push({
            dateInserted: moment.now(),
            dateExpiration: moment.now() + DEFAULT_EXPIRATION_TIME,
            user: user.uid,
            ...input
        })

    if (!snapshot) {
        throw new ErrorResponse(418, 'Could not insert the pock')
    }

    const ref = snapshot.ref.toString().split('/')
    const id = ref[ref.length - 1]

    // Step 3: If correctly inserted, insert the location
    try {
        const locationInserted = await addLocation(input.location, id)
        if (!locationInserted) {
            throw new ErrorResponse(418, 'Could not insert location')
        }
    } catch (e) {
        await admin.database().ref(`${MESSAGES_REF}/${id}`).remove()
        // Rethrow exception so the error handler can handle it, this catch is for a rollback when
        // the location could not be inserted correctly
        throw e
    }

    // Step 4: Return the freshly inserted pock from the database
    const pockInserted = await admin.database().ref(`${MESSAGES_REF}/${id}`).once('value')

    //Achievement Check
    if (moment(pockInserted.val().dateInserted).format("HH:mm") == "08:00") await userGetNewAchievement(user.uid, EASTER_EGG_4)

    const snapshotAllPocks = await admin.database().ref(MESSAGES_REF)
        .orderByChild("user")
        .equalTo(user.uid)
        .once('value')

    const pocks: PockMessage[] = []
    snapshotAllPocks.forEach((s: admin.database.DataSnapshot) => {
        pocks.push(new PockMessage(s.val()))
    })

    if (pocks.length == 1) await userGetNewAchievement(user.uid, FIRST_POCK)
    if (pocks.length == 10) await userGetNewAchievement(user.uid, TEN_POCK)
    if (pocks.length == 100) await userGetNewAchievement(user.uid, HUNDRED_POCK)
    if (pocks.length == 1000) await userGetNewAchievement(user.uid, THOUSAND_POCK)
    if (pocks.length == 517) await userGetNewAchievement(user.uid, EASTER_EGG_1)

    if (pocks.filter(p => p.category == "Salud").length === 13) {
        await userGetNewAchievement(user.uid, EASTER_EGG_2)
    }

    //Check Achievement: 1 mes sin Pock

    //Check Achievement: 1 pock/dia durante 10
    // const lastPocks = pocks.sort((a, b) => a.dateInserted - b.dateInserted).slice(0, 10)
    // if (lastPocks.length === 10) {
    //     let b = true
    //     for (let i = 0; i < 9; i++) {
    //         const m1 = moment(lastPocks[i].dateInserted)
    //         const m2 = moment(lastPocks[i + 1].dateInserted)
    //         if (m1.diff(m2, 'days') > 1 || m1.day() === m2.day()) {
    //             b = false
    //         }
    //
    //         if (b) {
    //             await userGetNewAchievement(user.uid, EASTER_EGG_7)
    //         }
    //     }
    // }

    return new PockMessage(Object.assign({}, pockInserted.val(), {id: pockInserted.key}))
}


