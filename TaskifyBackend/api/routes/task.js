'use strict'

let express = require('express'); // Express permite hacer las peticiones http
let multipart = require('connect-multiparty');
let TaskController = require('../controllers/task');
let mid_auth = require('../middlewares/auth');

let api = express.Router();

api.post('/createTask/:id', mid_auth.validateAuth, TaskController.createTask);
api.put('/update-task/:id', mid_auth.validateAuth, TaskController.updateTask);
api.put('/remove-task/:id', mid_auth.validateAuth, TaskController.removeTask);
api.put('/find-tasks-by-tag/:id', mid_auth.validateAuth, TaskController.findByTag);

module.exports = api;