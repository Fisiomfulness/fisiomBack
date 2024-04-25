// @ts-check
const httpStatus = require('http-status');
const PrettyError = require('pretty-error');

const pe = new PrettyError();

/** @type {import('express').ErrorRequestHandler} */
const errorHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  /** @type {keyof typeof httpStatus} */
  const errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  const errorMessage = err.message ?? httpStatus[errorCode];

  console.log(pe.render(err));

  res.status(errorCode).json({ message: errorMessage });
};

pe.skipNodeFiles();
pe.skipPackage('express');
pe.skipPackage('express-promise-router');

module.exports = { errorHandler };
