const User = require("#src/models/user/User");
const Professional = require("#src/models/profesional/Profesional")
const crypto = require('crypto')
const sendResetEmail = require('./sendResetEmail')

const sendLinkEmail = async(email) => {
    
    try{
     
       const[user, professional] = await Promise.all([
            User.findOne({ email }),
            Professional.findOne({ email}),
       ])

       const foundUser = user || professional

       if(!foundUser){console.log("El usuario no se encuentra registrado")}
       
       else{
            const tokenReset = crypto.randomBytes(32).toString('hex')
            foundUser.resetPasswordToken = tokenReset
            foundUser.resetPasswordExpiry = Date.now() +3600000 //Duración del token de una hora
            await foundUser.save()            
       }

       //envio de link a correo electrónico
       const resetLink = `${process.env.FRONT_URL}/reset_password?token=${tokenReset}&email=${email}`
       await sendResetEmail(email,resetLink)
       console.log("El link de reestablecimiento ha sido enviado con éxito")
       

    }
    catch{
          console.error("Error al enviar link de reestablecimiento:", error.message);
          throw new Error("Error al enviar link de reestablecimiento");
     }
}

export {
     sendLinkEmail,

}