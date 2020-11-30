'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let app = express() // Cargar el framework de express para hacer las conexiones que necesitemos y montar el servidor

// Cargar rutas
let user_routes = require('../api/routes/user');
let tag_routes = require('../api/routes/tag');
let task_routes = require('../api/routes/tag')

// let project_routes = [
//     user_routes,
//     tag_routes,
//     task_routes
// ]

// Middelwares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors

// rutas
app.use('/api', project_routes);
app.use('/api', tag_routes);
app.use('/api', task_routes);

module.exports = app