'use strict'

const {param} = require('../app');
const Task = require('../models/task');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');

function saveTask(req, res){
    let params = req.body;
    let task = new Task();

    if (params.tag && params.description){
        task.tag = params.tag;
        task.description = params.description;
        task.creation_date = moment().unix();
        task.due_date = null;
        task.status = false;

        task.save((err, taskStore) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al guardar la tarea."
                })
            }
            if(taskStore){
                return res.status(200).save({
                    message: "La tarea fue guardada correctamente",
                    task: taskStore
                })
            }else{
                return res.status(404).send({
                    message: "La tarea no pudo ser almacenada."
                })
            }
        })
    }else{
        return res.status(200).send({
            message: "La tarea no pudo ser almacenada."
        })
    }
}

module.exports = {
    saveTask
}