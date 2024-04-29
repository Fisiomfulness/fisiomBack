const { ForbiddenError } = require('../util/errors');

const permit = (...permittedRoles) => {
  return (req, res, next) => {
    if (!permittedRoles.includes(req.user.role)) {
      next(new ForbiddenError('You are not allowed to perform this action'));
    }
    next();
  };
};

module.exports = permit;
