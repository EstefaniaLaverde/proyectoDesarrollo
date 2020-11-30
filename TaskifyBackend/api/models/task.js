//Listo :)
'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TaskSchema = Schema({
    tag: {type: Schema.ObjectId, ref: 'Tag'},
    description: String,
    creation_date: String,
    // due_date: String,
    due_date: {type: Schema.ObjectId, ref: 'Day'},
    status: Boolean //Si la tarea ya se realizó o no
})

module.exports = mongoose.model('Task', TaskSchema);