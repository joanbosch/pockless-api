#PAPI 

**P**ockles **API** is the backend service for the Pockles aplication.

**PAPI** is a typescript API built around Firebase Functions and highly integrated into the Firebase ecosystem, using some of the services it provides.

## Requirements

* Node 10
* Npm or Yarn
 
## Get started

First of all, clone the repository.

Run `npm install` or `yarn install --pure-lockfile`, whatever you want to download the dependencies.

That's all :)

## How to use it

PAPI is available on [https://us-central1-pockles.cloudfunctions.net/api](https://us-central1-pockles.cloudfunctions.net/api).

## Documentation

Swagger documentation is available [here](https://us-central1-pockles.cloudfunctions.net/api/docs).

## Create a new endpoint

To create a new endpoint first you must localize to which module it belongs to, if it is already created, just add the call to the corresponding 
controller (under the controllers' folder), otherwise, create a new module and a new controller.

All endpoints are asynchronous, therefore they must return a ``Promise<Object>``, where `Object` is the type of the response you want to return. 
All the endpoints, no mather the method they use, must return something.
 
To not write too much boilerplate code, there is an util function inside ``BaseController``
(which must be extended by **ALL** of the controllers) called ``asPromise(executor)``, where `executor` is the async function we will run upon
the execution of the endpoint. Create pock endpoint is an example.

Executors are located inside each module, inside the duckies folder, with the name of what they do. Inside here you can write with your own rules.

## Test

### Local testing

To execute the functions locally use ``npm run emulator`` and do the calls normally from a tool. Postman is recommended.

### Remote testing

**NO, NEVER**, there's no dev, stage or pre-prod environment on firebase (AFAIK), therefore we will not deploy newer functions just 
to test them, if they work in local, they work in remote.

## Deploy 

It is mandatory to only deploy a release branch, otherwise it is forbidden to do so.

To deploy just call `npm run deploy`, it will handle all the deployment process.

A test will be done after each deploy to ensure the correct functioning of PAPI, if it does not work as expected, a rollback will be made.

## Postman

TBR
