import * as admin from "firebase-admin";
import { ErrorResponse } from "../../../common/error";
import { MESSAGES_REF } from "../../../common/paths";
import addLocation from '../../geolocation/actions/add-location'
import { CreatePockRestInput } from "../models/create-pock-rest-input"
import { PockMessage } from "../models/pock-message"
import {userGetNewAchievement} from "../../achievements/actions/achievement-checker";
import {
    EASTER_EGG_1,
    EASTER_EGG_2, EASTER_EGG_4,
    FIRST_POCK,
    HUNDRED_POCK,
    SAME_COORDS,
    TEN_POCK,
    THOUSAND_POCK,
    WELCOME_POCKLES
} from "../../achievements/achivements";
import moment from "moment";

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
    // Step 2: Insert into database
    const snapshot =
        await admin.database().ref(MESSAGES_REF).push({
            dateInserted: Date.now(),
            dateExpiration: Date.now() + DEFAULT_EXPIRATION_TIME,
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
    const now = moment()
    if(now.format("hh:mm") == "08:00") userGetNewAchievement(user.uid, EASTER_EGG_4)

    const snapshotAllPocks = await admin.database().ref(MESSAGES_REF)
        .orderByChild("user").equalTo(user.uid)
        .once('value')
    const pocks: PockMessage[] = []
    snapshotAllPocks.forEach((s: admin.database.DataSnapshot) => {
        pocks.push(new PockMessage(s.val()))
    })

    if (pocks.length == 1) userGetNewAchievement(user.uid, FIRST_POCK)
    if (pocks.length == 10) userGetNewAchievement(user.uid, TEN_POCK)
    if (pocks.length == 100) userGetNewAchievement(user.uid, HUNDRED_POCK)
    if (pocks.length == 1000) userGetNewAchievement(user.uid, THOUSAND_POCK)
    if (pocks.length == 517) userGetNewAchievement(user.uid, EASTER_EGG_1)

    let health_counter = 0
    pocks.forEach( p => {
        if (p.location == input.location) userGetNewAchievement(user.uid, SAME_COORDS)
        if (p.category == "Salud" && health_counter < 13) ++health_counter
        if (health_counter == 13) userGetNewAchievement(user.uid, EASTER_EGG_2)
    })


    //Check Achievement: 1 mes sin Pock

    //Check Achievement: 1 pock/dia durante 10


    return new PockMessage(Object.assign({}, pockInserted.val(), {id: pockInserted.key}))
}
