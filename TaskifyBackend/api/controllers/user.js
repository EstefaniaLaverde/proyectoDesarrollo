//Creo que está listo :)

'use strict'

let bcrypt = require('bcrypt-node');
const {param} = require('../app');
const user = require('../models/user');
let User = require('../models/user');
let jwt = require('../services/jwt');
let mongoosePaginate = require('mongoose-pagination');

function home(req, res){
    res.status(200).send(
    {saludo: "Hola gente organizada :)"}
)}

// function pruebas(req, res){
//     res.status(200).send(
//         {saludo: "Holita a todos los desarrolladores desde pruebas"}
//     )
// }

function saveUser(req, res){
    let params = req.body;
    let user = new User();

    if(params.name && params.lastName && params.email  && params.password){
        user.name = params.name;
        user.lastName = params.lastName
        user.email = params.email;
        user.password = params.password


        //Autenticación 

        //si necesito buscar dos cosas (and) solo voy poniendo las cosas con coma, sino, para un or:
        User.find({email: user.email}).exec((err, users)=>{ //AQUI ESTABA FALLANDO EL TOLOWERCASE
            
            if (err){
                return users.status(500).send(
                    {message: 'Hubo un error en la petición.'}
                )}
            if (users && users.length >=1) { //si existen los usuarios y son >=1
                return res.status(200).send({
                    message: 'El usuario ya está registrado con ese correo'
                })
            }else{
                bcrypt.hash(params.password, null, null, (err, hash) => { //Los null son opciones más avanzadas para hacer el hash
                    if(err){
                        console.log("Error haciendo la encriptación del password");
                    }
                    else{               
                        user.password = hash; 
                    }
                    user.save((err, userStored) => {
                        if(err) {
                            return res.status(500).send({
                                message: 'Error al guardar el usuario'
                            })
                        }
                        if(userStored){
                            return res.status(200).send({
                                message: 'El usuario fue almacenado correctamente',
                                user: userStored //para que no se guarde todo podemos devolver la informacion del usuario que necesitemos
                            })
                        }else{
                            return res.status(404).send({
                                message: 'El usuario no pudo ser almacenado correctamente'
                            })
                        }
                    })
                })
            }
           
        })   
    }else{
        res.status(200).send({
            message: "No se enviaron todos los campos. Debería haber nombre, apellido, correo y contraseña"
        })
    }
}

//Login de usuarios
function loginUsers(req,res) { //POST
    let params = req.body;
    let email = params.email;
    let password = params.password;

    //Comprobar que los parametros llegaron bien
    if (params.email && params.password) {
        //desencriptar el password
        User.findOne({email:email}, (err, user)=>{
            if(err){
                return res.status(500).send({message:"Hubo un error en la peticion del usuario"})
            }
            if (user) {
                
                bcrypt.compare(password, user.password, (err, check)=>{ //check es un bool
                    
                    if (err) {
                        return res.status(500).send({message:"No se completó la solicitud :( error"})
                    }
                    if (check) {
                        //aqui vamos a traer un token luego para comprobar que es el mismo usuario
                        //un token es la misma informacion del usuario pero se devuelve por medio de un json y tiene una contraseña 
                        // return res.status(200).send({user})
                        if (params.gettoken) {
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            user.password = undefined; //para que no retorne la contraseña
                            return res.status(200).send({user})
                        }
                        
                    }else{
                        return res.status(200).send({message:"El usuario no está registrado, verificar o registrarse"})
                    }
                })
            }
        })
        
    }else{
        return res.status(200).send({
            message:'No se encontró el e-mail del usuario o la contraseña'
        })
    }


}

//Traer la informacion del usuario
function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, user)=>{
        if (err) {
            return res.status(500).send({message: 'Hubo un error en la peticion'})
        }
        if (!user) {
            return res.status(200).send({message: 'Usuario no encontrado'})
        }
        return res.status(200).send((user))

    })
}

//Traer varios usuarios

function getUsers(req,res) {
    //sistema de paginacion para saber de a cuantos usuarios se trae
    let page = 1;

    if (req.params.page) {
        page = req.params.page
    }
    let docsPerPage = 5;

    User.find().sort('_id').paginate(page, docsPerPage, (err, users, total)=>{
        if (err) {
            return res.status(500).send({message: 'Hubo un error consultando los usuarios'})
        }
        if (!users) {
            return res.status(200).send({message: 'No hay usuarios para mostrar'})
        }
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/docsPerPage) //esto no me estaba funcionando help
        })
    })
}

function updateUser(req, res) { //Para poder cambiar por ejemplo el nombre
    if (!req.params.id) {
        return res.status(500).send({message: 'no se envió el id del usuario'})
    }
    let userId = req.params.id;
    let userUpdate = req.body;

    delete userUpdate.password; //Que no se pueda cambiar la contraseña

    if (userId != req.user.sub) { //Si el usuario de los parámetos no es el mismo que está logeado
        return res.status(500).send({message:'El usuario no tiene permisos para modificar este usuario'})
    }

    User.findByIdAndUpdate(userId, userUpdate, {new:true}, (err, userUpdate)=>{
        if (err) {
            return res.status(500).send({message: 'Error en la actualización'})
        }
        if (!userUpdate) {
            return res.status(500).send({message: 'No fueron enviados los datos para hacer la actualización'})

        }
        return res.status(200).send({userUpdate})

    })
}

//cargar la foto del usuario

module.exports = {
    home,
    // pruebas,
    saveUser,
    loginUsers,
    getUser,
    getUsers,
    updateUser
}