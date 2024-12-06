const {sendLinkEmail} = require('#src/services/sendLinkPass')

const indexNewPassword = async (req,res) => {
    try{
        const {email} = req.params;
        await sendLinkEmail(email)
        return res.status(201).json({message: "Link enviado con exito al correo"})
    }
    catch(error){
        console.error("Error en indexNewPassword:", error.message);
        return res.status(400).json({message: error.message})
    }
}

export{
    indexNewPassword
}