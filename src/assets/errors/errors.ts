// eslint-disable-next-line max-classes-per-file
interface IError {
  message: string,
  code?: number;
}

class BadRequestError extends Error implements IError {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 400;
  }
}

class UnauthorizedError extends Error implements IError {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 401;
  }
}

class ForbiddenError extends Error implements IError {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 403;
  }
}

class NotFoundError extends Error implements IError {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 404;
  }
}

class ConflictError extends Error implements IError {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 409;
  }
}

export {
  IError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError,
};
