'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
let Tag = require('../models/tag');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');

// Expresión regular para un color en hexadecimal
var RegExp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

function saveTag(req, res){
    let params = req.body;
    let tag = new Tag();
    // Revisamos que se envíe el nombre del tag
    if (params.name){
        tag.name = params.name;
        // Le damos un color aleatorio al tag
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        tag.color = '#' + randomColor;
        // Revisamos la existencia de duplicados
        Tag.find({name: tag.name.toLowerCase()}).exec((err, tags) => {

            if (err){
                return res.status(500).send({
                    message:"Hubo un error en la peticion"
                })
            }

            if (tags && tags.length >= 1){
                return res.status(200).send({
                    message: "Ya existe un tag con ese nombre."
                })
            }
        })

        return res.status(200).send({
            message: "El tag fue guardado exitosamente."
        })

    }else{
        return res.status(200).send({message : "¡Enviar el nombre del tag!"})
    }
}

function removeTag(req, res){
    let tagId = req.params.id;
    let tagRemove = req.body;
    // Revisamos que envíe el nombre del tag a eliminar
    if (tagRemove.name){ // DUDASS!!!
        Tag.findByIdAndRemove(tagId, (err, tagR) => {

            if (err){
                return res.status(500).send({
                    messsage : "Error en la eliminación."
                })
            }

            if (!tagR){ // ¿O tagRemove?
                return res.status(500).send({
                    message: "No se envió el nombre del tag a eliminar"
                })
            }

            return res.status(200).send({
                message: "El tag fue eliminado exitosamente",
                tagR
            })
        })
    }
}

function updateColor(req, res){
    let tagId = req.params.id;
    // Recibimos el nombre del tag y el nuevo color
    let tagUpdate = req.params;
    // Revisamos que se envie el nombre del tag, el nuevo color y que este esté en hexadecimal
    if (tagUpdate.name && tagUpdate.color && RegExp.test(tagUpdate.color)){
        Tag.findByIdAndUpdate(tagId, tagUpdate, {new:true}, (err, tagUp) => {
            if (err){
                return res.status(500).send({
                    message: "Error en la actualización."
                })
            }
            // Si no encuentra el tag
            if(!tagUp){
                return res.status(500).send({
                    message:"No se encontró el tag"
                })
            }

            return res.status(200).send({
                message: "El color fue modificado correctamente",
                tagUp
            })
        })
    }else{
        return res.status(500).send({
            message: "Faltan datos o no se ingresaron correctamente. Recuerde que el color es en formato hexadecimal."
        })
    }
}

module.exports = {
    saveTag,
    removeTag,
    updateColor
}