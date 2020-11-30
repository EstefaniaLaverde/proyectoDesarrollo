'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DaySchema = Schema({
    date: String
})

module.exports = mongoose.model('Day', DaySchema);