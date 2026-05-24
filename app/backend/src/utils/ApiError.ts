export class ApiError extends Error {
  statusCode: number;
  code?: any;

  constructor(statusCode: number, message: string, code?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
