import * as admin from "firebase-admin"
import * as geofire from "geofire"
import { ErrorResponse } from "../../../common/error"
import { LatLong } from "../../../common/models/lat-long"
import {MESSAGES_LOCATIONS_REF, MESSAGES_REF} from "../../../common/paths";
import {PockMessage} from "../models/pock-message";
import {now} from "moment";

export default async (): Promise<Array<LatLong>> => {


    //Step 1: Take an Snapshot of the Pocks and treat errors
    const snapshotOfAllPocks = await admin.database().ref(MESSAGES_REF)
        .orderByChild('dateExpiration')
        .endAt(now())
        .once('value')

    //Step2: Get All pock's location of the Snapshot
    const allPocksLocation: Array<LatLong> = []
    snapshotOfAllPocks.forEach((s: admin.database.DataSnapshot) => {
        allPocksLocation.push(new LatLong(s.val().location))
    })

    //Step 3: Return all locations
    return allPocksLocation
}
