'use strict'

let express = require('express'); // Express permite hacer las peticiones http
let multipart = require('connect-multiparty');
let TaskController = require('../controllers/task');
let mid_auth = require('../middlewares/auth');

let api = express.Router();

api.post('/createTask/:id', mid_auth.validateAuth, TaskController.saveTask);

module.exports = api;