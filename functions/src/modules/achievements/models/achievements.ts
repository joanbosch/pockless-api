import * as admin from "firebase-admin";

export class Achievements {
    achievementId: string;
    achievementName: string;
    description: string;
    achievementIcon: string;

    constructor(theId: string, theName: string, theDescription: string, theIcon: string) {
        this.achievementId = theId;
        this.achievementName = theName;
        this.description = theDescription;
        this.achievementIcon = theIcon
    }
}

admin.database().ref('/achievements').push({name: '¡Bienvenido a Pockles!', description: 'Te has unido a la familia Pockles', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Primer Pock!', description: 'Has publicado tu primer pock. ¡Enhorabuena!', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡10 Pocks!', description: 'Has publicado tu décimo pock. ¡Enhorabuena!', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡100 Pocks!', description: 'Has publicado tu centésimo pock. ¡Enhorabuena!', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡1000 Pocks!', description: 'Has publicado tu milésimo pock. ¡Enhorabuena!', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Tienes 10 Me Gusta!', description: 'Uno de tus Pocks ha gustado a 10 personas.', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Tienes 100 Me Gusta!', description: 'Uno de tus Pocks ha gustado a 100 personas ¡Wow!', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Has chateado con 5 personas!', description: 'Has iniciado una conversación con 5 usuarios.', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Has filtrado la lista de Pocks!', description: 'No todo quieren ver las mismas cosas...', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Has sido reportado!', description: 'Cuidado que sé donde vives, ¿eh? Vamos a portarnos bien.', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Has usado el mapa de calor!', description: 'Que calor hace... ¡Ah no! Que son los Pocks.', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Menuda puntería!', description: 'Has colocado dos Pocks exactamente en las mismas coordenadas. Rarito...', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Has mirado tu historial de Pocks!', description: 'Has mirado tu registro de Pocks. ¿De verdad pusiste eso?', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Llevas un año en Pockles!', description: 'Nadie se lo esperaba. Cuuumpleaños Feeeliz...', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: '¡Conseguiste todos los logros de Pockles!', description: '¡Eres un auténtico maestro de Pockles!', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: 'Secreto de Pockles nº1', description: 'EASTER EGG: Por crear 517 Pocks', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: 'Secreto de Pockles nº2', description: 'EASTER EGG: Por crear 13 Pocks de la categoría SALUD', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: 'Secreto de Pockles nº3', description: 'EASTER EGG: Por no poner ningún Pock durante un mes', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: 'Secreto de Pockles nº4', description: 'EASTER EGG: Por poner un Pock a las 8:00 AM', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: 'Secreto de Pockles nº5', description: 'EASTER EGG: Por mandarte 100 mensajes en un chat', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: 'Secreto de Pockles nº6', description: 'EASTER EGG: Por conseguir todos los logros normales', icon: 'lo que sea'})
admin.database().ref('/achievements').push({name: 'Secreto de Pockles nº7', description: 'EASTER EGG: Por poner 20 Pocks en un día', icon: 'lo que sea'})


