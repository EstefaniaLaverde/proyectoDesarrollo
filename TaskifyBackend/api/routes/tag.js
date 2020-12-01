'use strict'

let express = require('express'); // Express permite hacer las peticiones http
let multipart = require('connect-multiparty');
let TagController = require('../controllers/tag');
let mid_auth = require('../middlewares/auth');

let api = express.Router();


api.post('/createTag/:id', mid_auth.validateAuth, TagController.saveTag);
// DIFERENCIAS ENTRE GET, POST, PUT ... 
api.put('/removeTag/:id', mid_auth.validateAuth, TagController.removeTag);
api.put('/update-tag/:id', mid_auth.validateAuth, TagController.updateTagColor);
api.get('/tags/:page?', mid_auth.validateAuth, TagController.getTags);



module.exports = api;