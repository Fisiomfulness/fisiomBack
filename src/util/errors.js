const httpStatus = require('http-status');

class InvalidArgumentError extends Error {}

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

class ForbiddenError extends ApiError {
  constructor(message) {
    super(message, httpStatus.FORBIDDEN, 'ForbiddenError');
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
  InvalidArgumentError,
  ApiError,
  SemanticError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServiceError,
  UnauthorizedError,
};
