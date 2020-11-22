//Este middleware es el que nos autentica verdaderamente

let jwt = require('jwt-simple');
let moment = require('moment');
let secret_key = "RobaditaEsLaGataMasLinda"

function validateAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message:'Se necesita enviar el token'}) //no autorizado para esa informacion
    }
    let token = req.headers.authorization.replace(/['"]+/g, ''); //le quita las comillas al token
    try {
        var payload = jwt.decode(token, secret_key)//decodificamos la informacion del usuario
        if(payload.exp<=moment().unix()){
            return res.status(401).send({message: 'El token expiró'})
        }
    } catch{
        return res.status(404).send({message: 'El token no es válido'})
    }
    req.user = payload;
    next();
}

module.exports = {validateAuth}