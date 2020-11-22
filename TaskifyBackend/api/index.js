//Ya está :)

'use strict' // Utilizar todas las funcionalidades ECMASCRIPT 6 >

let mongoose= require('mongoose');
let app = require('./app');
let port = 4800;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TaskifyDB', // Esta es la ruta de conexión de la base de datos del proyecto
    {useMongoClient: true})// Usar el cliente de mongo
    .then(() => {
        console.log("Hola! Se hizo un cambio! :)")
        // Crear nuestro servidor
        app.listen(port, () => {
            console.log("El servidor fue creado correctamente y está corriendo en http://localhost:4800")
        })
    })
    .catch(err => console.log(err))