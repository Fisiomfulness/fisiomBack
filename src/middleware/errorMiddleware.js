const { ApiError } = require('../util/errors');

const errorMiddleware = (error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  if (error instanceof ApiError) {
    const { statusCode, name, message } = error;
    return res.status(statusCode).json({ statusCode, name, message });
  }

  res.status(500).json({ message: 'Error interno del servidor' });
};

module.exports = { errorMiddleware };
