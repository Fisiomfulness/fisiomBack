const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { verifyHashedData } = require("../../util/hashData");
const JWT_secret = process.env.JWT_secret;

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({ message: 'Usuario no encontrado' });
    }

    else {
      let credenciales = {}

      credenciales.email = email

      const coincidePass = await verifyHashedData(password, user.password)
      
      if(!coincidePass){
        res.status(404).json({ mensaje: "password incorrecto" })
      }else {
        res.status(200).json({ mensaje: "logeado" })
      }

    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}


// const login = async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({email, password });
//     if (user) {
//       const token = jwt.sign({ userId: user._id, role: user.role }, JWT_secret, { expiresIn: '1h' });
//       return res.status(200).json({user, token});
//     } else {
//       return res.status(401).json({ message: 'Usuario no encontrado' });
//     }
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// }

module.exports = {
  login
}