const nodemailer = require('nodemailer')
const {MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD} = process.env


const sendResetEmail = async (email, resetUrl) => {

    const transporter = nodemailer.createTrasnport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: false,
        user:{
            user: MAIL_USER,
            password: MAIL_PASSWORD
        }  
    })

    //const resetURL  = `https://your-frontend-url.com/reset-password?token=${resetToken}`; 
    const mailOptions = {
        from: MAIL_USER,
        to: email,
        subject: "Link de reestablecimiento",
        message: `Buen día señor(a) usuario(a). Aqui podria reestablecer su contraseña`,
    }

    try{
        await transporter.sendMail(mailOptions)
        console.log("El correo de reestablecimiento fue enviado con éxito")
    }
    catch{
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo de restablecimiento');
    }

}

export {
    sendResetEmail
}