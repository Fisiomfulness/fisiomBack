const { ForbiddenError } = require('../../util/errors');
const { JWT_SECRET } = require('../../config/envConfig');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (!req.user) next(new ForbiddenError('invalid token'));
  res.status(200).json(req.user);
};

module.exports = { verifyToken };
