const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');

const authUser = (req, res, next) => {
  // const token = req.cookies.token
  const authorization = req.get('authorization');
  let token = null;

  //cuando el token esta caduco, avisarle al cliente que inicie seccion de nuevo
  //para crear un nuevo token

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie('accessToken');
      return res.status(401).json({ message: 'Invalid token or expirated' });
    }
    if (decoded.role != ('professional', 'user')) {
      return res.status(403).json({ message: 'User without permissions' });
    }
    next();
  });
};

module.exports = authUser;
