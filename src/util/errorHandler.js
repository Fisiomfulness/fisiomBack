// @ts-check
const status = require('http-status');

/** @type {import('express').ErrorRequestHandler} */
const errorHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  /** @type {keyof typeof status} */
  const errorCode = status.INTERNAL_SERVER_ERROR;
  const errorMessage = status[errorCode];

  console.log('\n\x1b[33m' + errorMessage + ' ::: ' + err.message + '\x1b[0m');
  console.log('\n' + err.stack + '\n');

  res.status(errorCode).json({ message: errorMessage });
};

module.exports = { errorHandler };
