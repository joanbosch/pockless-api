import * as functions from "firebase-functions"
import * as admin from "firebase-admin";
import * as express from "express"
import { Server } from "typescript-rest";
import controllers from './controllers'
import { errorHandler, ErrorResponse } from "./common/error";
import { listPaths } from "./utils/testing";

admin.initializeApp();

const api = express()
Server.buildServices(api, ...controllers)

// Swagger is only visible in dev
Server.swagger(api, {
    endpoint: 'doc',
    filePath: './docs/swagger.yaml',
    host: 'localhost:5001/pockles/us-central1/api',
    schemes: [ 'https' ]
})

// Use it only for testing purposes, on deploy remove it
listPaths()

api.use((err: ErrorResponse, req: express.Request, res: express.Response, next: any) =>
    errorHandler(err, res))

exports.api = functions.https.onRequest(api)



