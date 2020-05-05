import * as express from "express"
import * as admin from "firebase-admin";
import * as functions from "firebase-functions"
import { Server } from "typescript-rest";
import { errorHandler, ErrorResponse } from "./common/error";
import controllers from './controllers'
import { listPaths } from "./utils/testing";

// const serviceAccount = require('C:\\Users\\Victor\\Desktop\\Pockles.json');
//
// // To execute the API locally and connected to the firebase database use this
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://pockles.firebaseio.com'
// });

// To deploy is is needed to just use this
admin.initializeApp();

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
listPaths()

// Adds the errorHandler as an error middleware to the express app
api.use((err: ErrorResponse, req: express.Request, res: express.Response, next: any) => errorHandler(err, res))

// Exports the express app so FirebaseFunction can know about it and call it in an endpoint request
exports.api = functions.https.onRequest(api)

admin.database().ref('/achievements').push({
    name: '¡Bienvenido a Pockles!',
    description: 'Te has unido a la familia Pockles',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fnew%20user.png?alt=media&token=1860a988-3d67-4b2a-976d-ffd90b652e40'
})
admin.database().ref('/achievements').push({
    name: '¡Primer Pock!',
    description: 'Has publicado tu primer pock. ¡Enhorabuena!',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fprimer%20pock.png?alt=media&token=afdb36de-1e90-4ebb-9e57-337424eff64f'
})
admin.database().ref('/achievements').push({
    name: '¡10 Pocks!',
    description: 'Has publicado tu décimo pock. ¡Enhorabuena!',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fdiez%20pock.png?alt=media&token=ec00251b-9496-4305-9e0e-a7fd40ffcbb9'
})
admin.database().ref('/achievements').push({
    name: '¡100 Pocks!',
    description: 'Has publicado tu centésimo pock. ¡Enhorabuena!',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fcien%20pock.png?alt=media&token=d87d1921-f159-4893-9a57-773775c53908'
})
admin.database().ref('/achievements').push({
    name: '¡1000 Pocks!',
    description: 'Has publicado tu milésimo pock. ¡Enhorabuena!',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2F1000%20pocks.png?alt=media&token=46aa8515-106d-43eb-80f9-438f8af7919e'
})
admin.database().ref('/achievements').push({
    name: '¡Tienes 10 Me Gusta!',
    description: 'Uno de tus Pocks ha gustado a 10 personas.',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2F10%20like.png?alt=media&token=995ed322-02cd-4591-b7e1-81dda408653a'
})
admin.database().ref('/achievements').push({
    name: '¡Tienes 100 Me Gusta!',
    description: 'Uno de tus Pocks ha gustado a 100 personas ¡Wow!',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2F100%20like.png?alt=media&token=b237bf7e-ad89-44a9-b77b-10770ca6f3a0'
})
admin.database().ref('/achievements').push({
    name: '¡Has chateado con 5 personas!',
    description: 'Has iniciado una conversación con 5 usuarios.',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2F5%20chat.png?alt=media&token=0a7805da-9323-4c54-8356-feffa5234cad'
})
admin.database().ref('/achievements').push({
    name: '¡Has filtrado la lista de Pocks!',
    description: 'No todo quieren ver las mismas cosas...',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2F__f__ltralo__makebadges-1586101989.png?alt=media&token=07f45840-fb54-4302-b421-93b50af6cd52'
})
admin.database().ref('/achievements').push({
    name: '¡Has sido reportado!',
    description: 'Cuidado que sé donde vives, ¿eh? Vamos a portarnos bien.',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2F1%20report.png?alt=media&token=8a314ab4-e779-445b-bd52-75fbe2293978'
})
admin.database().ref('/achievements').push({
    name: '¡Has usado el mapa de calor!',
    description: 'Que calor hace... ¡Ah no! Que son los Pocks.',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fmapa%20calor.png?alt=media&token=44783e4f-fc16-44be-9c7b-f034d6c899e1'
})
admin.database().ref('/achievements').push({
    name: '¡Menuda puntería!',
    description: 'Has colocado dos Pocks exactamente en las mismas coordenadas. Rarito...',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2F__qu__punter__a__makebadges-1586100409.png?alt=media&token=7ed7da30-34b5-4b4d-b40e-6ee0d6763192'
})
admin.database().ref('/achievements').push({
    name: '¡Has mirado tu historial de Pocks!',
    description: 'Has mirado tu registro de Pocks. ¿De verdad pusiste eso?',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fhistorial%20pocks.png?alt=media&token=f95d7c35-dee5-4383-bda3-2b14344807f1'
})
admin.database().ref('/achievements').push({
    name: '¡Llevas un año en Pockles!',
    description: 'Nadie se lo esperaba. Cuuumpleaños Feeeliz...',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fun%20a%C3%B1o%20en%20pockles.png?alt=media&token=d9b6b128-eeac-481f-8226-f950bf7a59f1'
})
admin.database().ref('/achievements').push({
    name: '¡Conseguiste todos los logros de Pockles!',
    description: '¡Eres un auténtico maestro de Pockles!',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Fall%20logros.png?alt=media&token=90cb68c6-ae1c-422d-8d02-aaf1ca5fbde6'
})
admin.database().ref('/achievements').push({
    name: 'Secreto de Pockles nº1',
    description: 'EASTER EGG: Por crear 517 Pocks',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Feaster%20egg%201.png?alt=media&token=0bfa48fc-1d9c-48a6-9e1b-2337adbacf7e'
})
admin.database().ref('/achievements').push({
    name: 'Secreto de Pockles nº2',
    description: 'EASTER EGG: Por crear 13 Pocks de la categoría SALUD',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Feaster%20egg%202.png?alt=media&token=3ae923ab-61e7-4c6e-8e7b-963f283ebbb1'
})
admin.database().ref('/achievements').push({
    name: 'Secreto de Pockles nº3',
    description: 'EASTER EGG: Por no poner ningún Pock durante un mes',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Feaster%20egg%203.png?alt=media&token=e8b0a5a5-024e-42bc-8004-d24182c4249b'
})
admin.database().ref('/achievements').push({
    name: 'Secreto de Pockles nº4',
    description: 'EASTER EGG: Por poner un Pock a las 8:00 AM',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Feaster%20egg%204.png?alt=media&token=71db852f-3a2b-49a6-8d88-20217766a114'
})
admin.database().ref('/achievements').push({
    name: 'Secreto de Pockles nº5',
    description: 'EASTER EGG: Por mandarte 100 mensajes en un chat',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Feaster%20egg%205.png?alt=media&token=1639f6d7-ec11-4f60-a1a1-8b837fa94ac4'
})
admin.database().ref('/achievements').push({
    name: 'Secreto de Pockles nº6',
    description: 'EASTER EGG: Por conseguir todos los logros normales',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Feaster%20egg%206.png?alt=media&token=0d87aaf2-8203-479b-a8d8-ebeca5a34252'
})
admin.database().ref('/achievements').push({
    name: 'Secreto de Pockles nº7',
    description: 'EASTER EGG: Por poner 20 Pocks en un día',
    icon: 'https://firebasestorage.googleapis.com/v0/b/pockles.appspot.com/o/achievementIcon%2Feaster%20egg%207.png?alt=media&token=1bb7eec9-5c82-4a42-9f35-2482688760ee'
})



