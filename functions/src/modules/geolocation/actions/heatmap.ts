import * as admin from "firebase-admin"
import * as geofire from "geofire"
import { ErrorResponse } from "../../../common/error"
import { LatLong } from "../../../common/models/lat-long"
import { MESSAGES_LOCATIONS_REF } from "../../../common/paths";
import {PockMessage} from "../../pocks/models/pock-message";

try {
    // lack of response means the promise has been fulfilled, therefore it has been correctly inserted
    // @ts-ignore
    return PockMessage.getAllLocations()
} catch (e) {
    // @ts-ignore
    return null
}
