'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let app = express() // Cargar el framework de express para hacer las conexiones que necesitemos y montar el servidor

// Cargar rutas
let user_routes = require('../api/routes/user');
let tag_routes = require('../api/routes/tag');

// Middelwares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors

// rutas
app.use('/api', user_routes);
app.use('/api', tag_routes);

module.exports = app;