import * as express from "express"
import {AppClient} from "../auth/app-client";
import {ErrorResponse} from "../error";

// TODO (victor): Could this be converted to the standard AppUserAgent? Does Retrofit allow to put the AppUserAgent easily?
export const APP_CLIENT_HEADER_NAME = 'AppClient'

/**
 * Checks the headers of the api call to only allow to the {@param appClientsAllowed} access to it.
 *
 * Use it as a preprocessor.
 *
 * @Example
 * Only allow calls with the {@link AppClient#POCKLES} to have access:
 * `@PreProcessor(appClientAuthenticator([ AppClient.POCKLES ]))`
 *
 * Allow more than one:
 * `@PreProcessor(appClientAuthenticator([ AppClient.POCKLES, AppClient.OTHER_APPCLIENT ]))`
 *
 * To remove this authenticator for certain API calls just do not put the preprocessor decorator
 * on it.
 *
 * @param appClientsAllowed
 */
export const appClientAuthenticator = (appClientsAllowed: AppClient[]) => {
    return function (req: express.Request) {
        const appClientRequest = req.header(APP_CLIENT_HEADER_NAME)
        if (!appClientRequest || !appClientsAllowed.find(appClient => appClient === appClientRequest)) {
            throw new ErrorResponse(403, 'AppClient is not authorized')
        }
    }
}
