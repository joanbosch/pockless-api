import * as admin from "firebase-admin"
import { now } from "moment";
import { LatLong } from "../../../common/models/lat-long"
import { MESSAGES_REF } from "../../../common/paths";

export default async (): Promise<LatLong[]> => {

    //Step 1: Take an Snapshot of the Pocks and treat errors
    const snapshotOfAllPocks = await admin.database().ref(MESSAGES_REF).once('value')

    //Step2: Get All pock's location of the Snapshot
    const allPocksLocation: LatLong[] = []
    snapshotOfAllPocks.forEach((s: admin.database.DataSnapshot) => {
        if (!s.val().hidden && s.val().dateExpiration >= now()) {
            allPocksLocation.push(new LatLong(s.val().location))
        }
    })

    //Check Achievement: usar heatmap

    //Step 3: Return all locations
    return allPocksLocation
}
