const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');

const authAll = (req, res, next) => {
  const token = req.cookies['accessToken'];
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie('accessToken');
      return res.status(401).json({ message: 'Token expirado o invalido' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authAll;
