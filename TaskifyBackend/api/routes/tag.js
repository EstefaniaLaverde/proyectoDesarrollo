'use strict'

let express = require('express'); // Express permite hacer las peticiones http
let multipart = require('connect-multiparty');
let TagController = require('../controllers/tag');
let mid_auth = require('../middlewares/auth');

let api = express.Router();


api.post('/create/:id', mid_auth.validateAuth, TagController.saveTag);

module.exports = api;