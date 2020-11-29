'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
let Tag = require('../models/tag');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');

function saveTag(req, res){
    let params = req.body;
    let tag = new Tag();

    if (params.name){
        tag.name = params.name;
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        tag.color = '#' + randomColor;

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

module.exports = {
    saveTag
}