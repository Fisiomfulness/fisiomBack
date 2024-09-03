const { ForbiddenError } = require('../util/errors');

const permit = (...permittedRoles) => {
  return (req, res, next) => {
    if (!permittedRoles.includes(req.user.role)) {
      next(new ForbiddenError('No tienes permiso para realizar esta acción'));
    }
    next();
  };
};

module.exports = permit;
