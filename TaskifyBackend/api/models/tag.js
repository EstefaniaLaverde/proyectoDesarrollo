//Listo :)
'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TagSchema = Schema({
    name: String,
    color:String,
    user: {type: Schema.ObjectId, ref: 'User'},
})

module.exports = mongoose.model('Tag', TagSchema);