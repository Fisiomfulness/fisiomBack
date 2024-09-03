const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');

const adminAuthMiddleware = (req, res, next) => {
  // const token = req.cookies.token
  const authorization = req.get('authorization');
  let token = null;

  //cuando el token esta caduco, avisarle al cliente que inicie seccion de nuevo
  //para crear un nuevo token

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'Falta el token o no es válido' });
  }

  if (!token) {
    return res.status(401).json({ message: 'Falta el token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalido o expirado' });
    }
    if (decoded.role != 'admin') {
      return res.status(403).json({ message: 'Usuario sin permisos' });
    }
    next();
  });
};

module.exports = { adminAuthMiddleware };
