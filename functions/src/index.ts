import * as functions from "firebase-functions"
import * as admin from "firebase-admin";
import * as express from "express"
import { Server } from "typescript-rest";
import controllers from './controllers'
import { listPaths } from "@/utils/testing";

admin.initializeApp();

const api = express()
Server.buildServices(api, ...controllers)

Server.swagger(api, {
    endpoint: 'docs',
    filePath: './docs/swagger.yaml',
    host: 'localhost:5001/pockles/us-central1/api',
    schemes: [ 'http' ]
})

// Use it only for testing purposes, on deploy remove it
// listPaths()

// TODO: Custom error handler

exports.api = functions.https.onRequest(api)



