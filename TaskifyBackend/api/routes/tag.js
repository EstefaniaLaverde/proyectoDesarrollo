'use strict'

let express = require('express'); // Express permite hacer las peticiones http
let multipart = require('connect-multiparty');
let TagController = require('../controllers/tag');
let mid_auth = require('../middlewares/auth');

let api = express.Router();


api.post('/createTag/:id', mid_auth.validateAuth, TagController.saveTag);
// DIFERENCIAS ENTRE GET, POST, PUT ... 
api.put('/removeTag/:id', mid_auth.validateAuth, TagController.removeTag);
api.put('/update-color-tag/:id', mid_auth.validateAuth, TagController.updateColor);

module.exports = api;