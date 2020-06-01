import * as express from "express"
import * as admin from "firebase-admin";
import * as functions from "firebase-functions"
import { Server } from "typescript-rest";
import { errorHandler, ErrorResponse } from "./common/error";
import controllers from './controllers'


if (process.env.DEVELOPMENT) {
    console.log("Using development")
    admin.initializeApp({
        credential: admin.credential.cert(require('../Pockles.json')),
        databaseURL: 'https://pockles.firebaseio.com'
    });
} else {
    admin.initializeApp();
}

const api = express()

Server.buildServices(api, ...controllers)

// Swagger is only visible in dev
Server.swagger(api, {
    endpoint: 'doc',
    filePath: './docs/swagger.yaml',
    host: 'localhost:5001/pockles/us-central1/api',
    schemes: [ 'http' ]
})

// Use it only for testing purposes, on deploy remove it
// Useful to know if you have declared correctly the endpoint
// listPaths()

// Adds the errorHandler as an error middleware to the express app
api.use((err: ErrorResponse, req: express.Request, res: express.Response, next: any) => errorHandler(err, res))

// Exports the express app so FirebaseFunction can know about it and call it in an endpoint request
exports.api = functions.https.onRequest(api)


