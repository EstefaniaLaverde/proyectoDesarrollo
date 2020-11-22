'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DaySchema = Schema({
    tasks:  {type: Schema.ObjectId, ref: 'Task'}
})

module.exports = mongoose.model('Day', DaySchema);