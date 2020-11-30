// Listo :)
'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    name: String,
    lastName: String,
    email: String,
    password: String
})

module.exports = mongoose.model("User", UserSchema);