import * as admin from "firebase-admin"
import * as geofire from "geofire"
import { ErrorResponse } from "../../../common/error"
import { LatLong } from "../../../common/models/lat-long"
import {MESSAGES_LOCATIONS_REF, MESSAGES_REF} from "../../../common/paths";
import {PockMessage} from "../../pocks/models/pock-message";
import {now} from "moment";

export default async (user: any): Promise<Array<LatLong>> => {
    //Step 1: Take all Ids of the Pocks Table
    const allIds = PockMessage.getAllIds()

    //Step2: Get the pock related to this Id and check user not null and if can see +18 pocks

    const returnLocationList: Array<LatLong> = []
    const filterSensiblePocks = user != null && !user.isOlderThan18()

    for (const pockId of allIds) { //if using forEach and async it doesn't return any pock
        const onePock = await admin.database().ref(`${MESSAGES_REF}/${pockId}`)
            .orderByChild('dateExpiration')
            .endAt(now())
            .once('value')

        // If database returned nothing, means that it has expired
        if (onePock != null && onePock.val() !== null) {
            if (!filterSensiblePocks || onePock.val().category !== '+18') {
                returnLocationList.push(onePock.val().location) //push the location
            }
        }
    }
    //Step 3: Return all locations
    return returnLocationList
}
