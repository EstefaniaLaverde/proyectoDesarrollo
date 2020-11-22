//jwt es el formato por el cual va a quedar encripatado 
//los servicios son pequeñas funciones que utilizaremos en muchos lugares

let jwt = require('jwt-simple');
let moment = require('moment'); //nos ayuda con todo lo de fechas y horas
let secret_key = "RobaditaEsLaGataMasLinda" // esto luego se meterá en un archivo de configuracion

function createToken(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        //el token puede expirar en x cantidad de tiempo
        lat: moment().unix(), //fecha actual y unix para no tener problemas con fechas de otros lugares
        exp: moment().add(30, 'days') //fecha de expiracion del token
    }
    
    try {
        return jwt.encode(payload, secret_key)
    } catch (error) {
        console.log('Hubo un error en la codificacion del token')
    }
}

module.exports = {
    createToken
}