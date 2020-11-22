//Listo :)
'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TagSchema = Schema({
    name: String,
    color:String
})

module.exports = mongoose.model('Tag', TagSchema);