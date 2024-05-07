const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');

const decodeTokenUser = (req, res, next) => {
  const token = req.cookies?.accessToken

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        // if theres a problem with the cookie delete it
        if (err) {
            res.clearCookie('accessToken');
        }
        // else save the userId in the request
        req.tokenUser = decoded;
    });
  }
  next();
};

module.exports = { decodeTokenUser };