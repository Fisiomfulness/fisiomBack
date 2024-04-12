const { JWT_SECRET } = require('../../config/envConfig');
const { verifyHashedData } = require("../../util/hashData");
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(201).json({ message: 'Usuario no encontrado' });
    }

    else {
      const coincidePass = await verifyHashedData(password, user.password)

      if (!coincidePass) {
        res.status(201).json({ message: "Password incorrecto" })
      } else {
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })

        /*
      - Colocar estos parametros dentro de cookie en un obj como tercer parametro para producion
      httpOnly: true, // Evitar acceso desde JavaScript del cliente
      secure: true, // Usar solo sobre HTTPS (si es posible)
      maxAge: 1000 * 60 * 60, // Una hora en milisegundos
      sameSite: 'strict', // Mitigar vulnerabilidades CSRF
    */
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60, sameSite: 'strict' });

        return res.status(200).json({ message: 'Sesión iniciada con éxito' });
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
  login,
};
