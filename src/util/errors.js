const httpStatus = require('http-status');

// ? Blueprint for our errors, don't throw it
class ApiError extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.type = 'ApiError';
    this.statusCode = statusCode;
    this.name = name;
  }
}

// ? Client BadRequest.
class BadRequestError extends ApiError {
  constructor(message) {
    super(message, httpStatus.BAD_REQUEST, 'BadRequestError');
  }
}

// ? Unauthorized
class UnauthorizedError extends ApiError {
  constructor(message) {
    super(message, httpStatus.UNAUTHORIZED, 'UnauthorizedError');
  }
}

// ? Not found.
class NotFoundError extends ApiError {
  constructor(message) {
    super(message, httpStatus.NOT_FOUND, 'NotFoundError');
  }
}

// ? Conflict with the valid resource sent.
class ConflictError extends ApiError {
  constructor(message) {
    super(message, httpStatus.CONFLICT, 'ConflictError');
  }
}

// ? User semantic error.
class SemanticError extends ApiError {
  constructor(message) {
    super(message, httpStatus.UNPROCESSABLE_ENTITY, 'SemanticError');
  }
}

// ? Service Unavailable: The third party request couldn't be handled.
class ServiceError extends ApiError {
  constructor(message) {
    super(message, httpStatus.SERVICE_UNAVAILABLE, 'ServiceError');
  }
}

module.exports = {
  ApiError,
  SemanticError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  ServiceError,
  UnauthorizedError,
};
