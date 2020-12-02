'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DaySchema = Schema({
    date: String,
    user: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Day', DaySchema);