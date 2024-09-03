const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');

const decodeTokenUser = (req, res, next) => {
  const token = req.cookies['accessToken'];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie('accessToken');
      req.user = null;
    }
    req.user = decoded;
    next();
  });
};

module.exports = { decodeTokenUser };