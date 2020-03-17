import { ErrorResponse } from "../../error";
import { AppClient } from "../app-client";
import { appClientAuthenticator } from "../app-client-authenticator";

const req = {
    header: () => AppClient.POCKLES
}

describe('appClientAuthenticator', () => {
    describe('given an execution with an allowed app client', () => {
        const authenticator = appClientAuthenticator([ AppClient.POCKLES ])
        it('should do nothing', () => {
            // @ts-ignore
            expect(() => authenticator(req)).not.toThrow(ErrorResponse)
        });
    })

    describe('given an execution with NOT an allowed app client', () => {
        const authenticator = appClientAuthenticator([])
        it('should throw an exception', () => {
            // @ts-ignore
            expect(() => authenticator(req)).toThrow(ErrorResponse)
        });
    })
})
