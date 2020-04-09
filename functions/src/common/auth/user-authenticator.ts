import * as express from "express";
import admin from "firebase-admin";
import { ErrorResponse } from "../error";

/**
 * Checks if there is a Bearer token present in the Authorization header
 * and then proceeds to check if the available token is a user. If it is, the user
 * is added back to the request parameters, later {@link BaseController} will inject
 * this user in every request (is up to the action to take the user and do things with
 * it)
 *
 * @param req
 */
export const userAuthentication = async (req: express.Request) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        throw new ErrorResponse(401, "Unauthorized")
    }
    const idToken = req.headers.authorization.split('Bearer ')[1]
    try {
        req.user = await admin.auth().verifyIdToken(idToken)
    } catch (e) {
        throw new ErrorResponse(401, "Unauthorized")
    }
}
