const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');

const authAll = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  //console.log(token);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next();
  });
};

module.exports = authAll;
