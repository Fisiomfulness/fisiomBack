//Código para enviar link para el correo electrónico
const crypto = require('crypto')
const {findUserByEmail} = require('../login')
const {NotFoundError}= require('#src/util/errors');
const {sendResetEmail} = require('./sendEmailPass')


const sendPaswordEmail = async(email) => {

    //Verificación de correo ingresado
    if(!email){throw new NotFoundError("Por favor ingrese un correo electrónico")}
    
    //Busqueda de usuario por correo electrónico
    else{

        const foundUser = await findUserByEmail(email)
        if(!foundUser){throw new NotFoundError("Usuario no encontrado")}

        //Generación de token para enviar link de recuperación y la expiración de la misma
        const resetToken = crypto.randomBytes(32).toString('hex')
        foundUser.resetPasswordToken= resetToken
        foundUser.resetPasswordExpiry = Date.now() + 3600000; // 1 hora
        await foundUser.save();       

        //Envio de URL de reestablecimiento para contraseña
        const urlRestore= `${email}`


        //Envio del hipervinculo al correo
        await sendResetEmail(email, urlRestore)
        console.log(`Correo de link de cambio de contraseña enviado a ${email}`) 
    }
}

module.exports ={
    sendPaswordEmail,
}
