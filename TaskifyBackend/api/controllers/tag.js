'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
let Tag = require('../models/tag');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');
const auth = require('../middlewares/auth');

// Expresión regular para un color en hexadecimal
var RegExp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

function saveTag(req, res){
    if (!req.params.id) {//Si no se envia el usuario al que crearle el task
        return res.status(500).send({message: 'no se envió el id del usuario'})
    }
    let userId = req.params.id;
    let params = req.body;
    let tag = new Tag();
    
    if (userId !=req.user.sub) { //Si no coincide el id del usuario al que equeremos añadirle un tag
        console.log(userId,'el de jwt: ',req.user.sub)
        return res.status(500).send({message:'No tiene permisos para modificar los tags de este usuario'})
    }
    else{ //Si si coincide
        if (params.name && userId){
            tag.name = params.name.toLowerCase();
            tag.user = userId;
            // Le damos un color aleatorio al tag si no se da uno
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            tag.color = '#' + randomColor;
    
            // Revisamos la existencia de duplicados
            Tag.find({name: tag.name.toLowerCase(), user: userId}).exec((err, tags) => {
    
                if (err){
                    return res.status(500).send({
                        message:"Hubo un error en la peticion"
                    })
                }
    
                if (tags && tags.length >= 1){ //
                    return res.status(200).send({
                        message: "Ya existe un tag con ese nombre para este usuario."
                    })
                
                }else{

                    tag.save((err,tagStored)=>{
                        if(err) {
                            return res.status(500).send({
                                message: 'Error al guardar el tag'
                            })
                        }
                        if(tagStored){
                            return res.status(200).send({
                                message: 'El tag fue almacenado correctamente',
                                tag: tagStored //para que no se guarde todo podemos devolver la informacion del usuario que necesitemos
                            })
                        }else{
                            return res.status(404).send({
                                message: 'El tag no pudo ser almacenado correctamente'
                            })
                        }
                    })
                }
            })
            
        }else{
            return res.status(200).send({message : "¡Enviar el nombre del tag y el usuario!"})
        }
    }

    
}

function removeTag(req, res){
    if (!req.params.id) {//Si no se envia el usuario al que crearle el task
        return res.status(500).send({message: 'no se envió el id del usuario'})
    }
    let userId = req.params.id;
    let tagRemove = req.body; 
    let tagRemoveName = tagRemove.name//Lo vamos a buscar por nombre
    
    if (userId !=req.user.sub) { //Si no coincide el id del usuario al que equeremos añadirle un tag
        console.log(userId,'el de jwt: ',req.user.sub)
        return res.status(500).send({message:'No tiene permisos para modificar los tags de este usuario'})
    }else{
        if (!tagRemoveName) {
            return res.status(500).send({
                messsage : "No se envió el nombre del tag."
            })
        }
        Tag.findOneAndRemove({name: tagRemoveName, user: userId}, (err, tagToRemove)=>{
            if (err) {
                return res.status(500).send({
                    messsage : "Error en la eliminación."
                })
            }if (!tagToRemove) {
                return res.status(500).send({
                    message : "No se encontró el tag para borrarlo."
                })
            }else{
                return res.status(200).send({
                    message : "El tag "+tagRemoveName+" fue removido correctamente."
                })
            }
        })
    }
}

function updateTagColor(req, res){
    if (!req.params.id) {//Si no se envia el usuario al que crearle el task
        return res.status(500).send({message: 'no se envió el id del usuario'})
    }
    let userId = req.params.id;
    let tagUpdate = req.body;
    //Se tiene que enviar en el body el nombre del tag a cambiar y el color
    let tagUpdateName = tagUpdate.name;
    let tagUpdateColor = tagUpdate.color;

    delete tagUpdate.user; //Que no se pueda cambiar el ususario a la que le corresponde
    
    if (userId !=req.user.sub) { //Si no coincide el id del usuario al que equeremos añadirle un tag
        return res.status(500).send({message:'No tiene permisos para modificar los tags de este usuario'})
    }

    if (tagUpdateName && tagUpdateColor && RegExp.test(tagUpdateColor)) {
        Tag.findOneAndUpdate({name:tagUpdateName, user:userId}, tagUpdate, {new:true},(err,tagToUpdate)=>{
            console.log(tagToUpdate)
            if (err) {
                return res.status(500).send({
                    messsage : "Error en el update del color."
                })
            }
            if(!tagToUpdate){
                return res.status(500).send({
                    messsage : "No se encontró el tag con ese nombre para su usuario"
                })
            }else{
                return res.status(200).send({
                    message : "El color del tag "+tagUpdateName+" fue cambiado correctamente."
                })
            }
        })


    }else{
        return res.status(500).send({
            message: "Faltan datos o no se ingresaron correctamente. Recuerde que el color es en formato hexadecimal."
        })
    }

}

function getTags(req,res) { //El paginate no funciona del todo
    let page = 1;
    if (req.params.page) {
        page = req.params.page
    }
    let docsPerPage = 5;

    Tag.find().sort('_id').paginate(page, docsPerPage, (err, tags, total)=>{

        if (err) {
            return res.status(500).send({message: "hubo un error consultando los tags"})
        }if (!tags) {
            return res.status(200).send({message: 'No hay usuarios para mostrar'})
        }
        return res.status(200).send({
            tags,
            total,
            pages: Math.ceil(total/docsPerPage)
        })
    })
}

module.exports = {
    saveTag,
    removeTag,
    updateTagColor,
    getTags
}