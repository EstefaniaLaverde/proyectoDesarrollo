'use strict'

const {param} = require('../app');
const Task = require('../models/task');
const Tag = require('../models/tag');
const tagControllers = require('../controllers/tag');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');

function createTask(req, res){
    let params = req.body;
    let task = new Task();
    let userId = req.params.id;

    if (!userId) {
        return res.status(500).send({message: 'No se envió el Id del usuario'})
    }

    if (userId != req.user.sub) {
        // console.log(userId,'el de jwt: ',req.user.sub)
        return res.status(500).send({message:'No tiene permisos para modificar/crear las tareas de este usuario'})
    }else{
        if (params.tag && params.description) { //params.tag es el nombre del tag
            //Checkear que el tag fue creado
            Tag.findOne({name: params.tag, user: userId},(err,foundTag)=>{
                if (err) {
                    return res.status(500).send({message:'Error en la busqueda del tag'})
                }if (!foundTag){
                    return res.status(500).send({message:'No se encontró el tag con ese nombre para su usuario. Creelo primero'})
                    //Opción para crear el tag [NO FUNCIONA]
                    // newTag = tagControllers.saveTag(req, res);
                    // tagToSave = newTag.tag;
                    // console.log(tagToSave); 
                }else{
                    task.tag = foundTag;
                }
            })
            task.description = params.description;
            task.creation_date = moment().unix();
            // console.log(moment.unix().toDate());
            task.status = false;
            //  task.due_date = moment().unix(); //Por defecto, due_date = creation_date
            if (params.due_date){
                task.due_date = params.due_date;
            }else{
                task.due_date = moment().unix(); //Por defecto, due_date = creation_date
            }
            

            //Guardando el nuevo task
            task.save((err, taskStore) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error al guardar la tarea."
                    })
                }
                if(taskStore){
                    // return res.status(200).save({  // ESTA LINEA PUEDE QUE SEA LA DEL ERROR
                    return res.status(200).send({
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
                message: "No se enviaron todos los campos necesarios."
            })
        }
    }
}

// function removeTask(req,res) {
    
// }

function updateTask(req,res) {
    if (!req.params.id) {//Si no se envia el usuario al que crearle el task
        return res.status(500).send({message: 'no se envió el id del usuario'})
    }
    let userId = req.params.id;
    let taskUpdate = req.body; //enviamos el id de la tarea

    delete taskUpdate.user; //No se puede cambiar el usuario
    delete taskUpdate.creation_date; //No se puede cambiar la fecha de creación

    if (userId != req.user.sub) {
        return res.status(500).send({message:'No tiene permisos para modificar los tags de este usuario'})
    }if (taskUpdate.id) {
        Task.findByIdAndUpdate(taskUpdate.id, taskUpdate, {new:true}, (err, taskUpdated)=>{
            if (err) {
                return res.status(500).send({message: 'Hubo un error en la peticion'})
            }if (!taskUpdated) {
                return res.status(500).send({message: 'No se encontró la tarea para modificar'})
            }else{
                if (taskUpdate.status && taskUpdate.status == true) {
                    //AQUI VA A IR LA FUNCION PARA BORRAR LA TAREA SI SE CAMBIA DE STATUS
                }
                return res.status(200).send({taskUpdated})
            }
        })
    }else{ 
        return res.status(500).send({message:'Envie el id de la tarea que se quiere modificar'})
    }
    
}



module.exports = {
    createTask,
    updateTask
}