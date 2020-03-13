# PAPI 

**P**ockles **API** is the backend service for the Pockles aplication.

**PAPI** is a typescript API built around Firebase Functions and highly integrated into the Firebase ecosystem, using some of the services it provides.

## Requirements

* Node 10
* Npm or Yarn
 
## Get started

Run `npm install` or `yarn install --pure-lockfile`, whatever you want to download the dependencies.

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
(which must be extended by **ALL** of the controllers) named ``asPromise(executor)``, where `executor` is the async function it will run upon
the execution of the endpoint. Create pock endpoint is an example.


Executors are located inside each module, inside the actions folder, with the name of what they do. Inside here you can write with your own rules.

## Test

### Local testing

To execute the functions locally use ``npm run emulator`` and do the calls normally from a tool. Postman is recommended.

## Deploy 

To deploy just call `npm run deploy`, it will handle all the deployment process. Do not deploy just for test, testing should be
only made in local.

## Postman

You can obtain the Postman collection [here](https://www.getpostman.com/collections/f9eb887003a02a059087).

The environments (dev and prod) are inside the docs folder.
