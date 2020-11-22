//Listo :)
'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TaskSchema = Schema({
    tag: {type: Schema.ObjectId, ref: 'Tag'},
    description: String,
    creation_date: String,
    due_date: String,
    status: Boolean //Si la tarea ya se realizó o no
})

module.exports = mongoose.model('Task', TaskSchema);