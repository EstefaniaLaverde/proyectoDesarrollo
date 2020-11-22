'use strict'

let express = require('express');
let UserController = require('../controllers/user');
const { model } = require('../models/user');
let mid_auth = require('../middlewares/auth');

let api = express.Router() // Aquí están todos los métodos con los que nosotros podemos hacer cualquier tipo de peticiones get/post/patch...

api.get('/home', UserController.home);
// api.get('/pruebas', mid_auth.validateAuth, UserController.pruebas); No lo necesitamos (creo)
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUsers);
//Traer informacion de un usuario con un id específico
api.get('/user/:id', mid_auth.validateAuth, UserController.getUser)
api.get('/users/:page?', mid_auth.validateAuth, UserController.getUsers) // el ? es que la pagina es opcional
//modificacon de los datos del usuario
api.put('/update-user/:id', mid_auth.validateAuth, UserController.updateUser)

module.exports = api;