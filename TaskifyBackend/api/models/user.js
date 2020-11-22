// Listo :)
'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    tasks:{type: Schema.ObjectId, ref: 'Task'}
})

module.exports = mongoose.model("User", UserSchema);