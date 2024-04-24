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
    super(message, 400, 'BadRequestError');
  }
}

// ? Unauthorized
class UnauthorizedError extends ApiError {
  constructor(message) {
    super(message, 401, 'UnauthorizedError');
  }
}

// ? Not found.
class NotFoundError extends ApiError {
  constructor(message) {
    super(message, 404, 'NotFoundError');
  }
}

// ? Conflict with the valid resource sent.
class ConflictError extends ApiError {
  constructor(message) {
    super(message, 409, 'ConflictError');
  }
}

// ? User semantic error.
class SemanticError extends ApiError {
  constructor(message) {
    super(message, 422, 'SemanticError');
  }
}

// ? Service Unavailable: The third party request couldn't be handled.
class ServiceError extends ApiError {
  constructor(message) {
    super(message, 503, 'ServiceError');
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
