/**
 * @summary
 * Custom Error class for operational errors that are known and handled.
 * This allows distinguishing between expected errors (like 'Invalid ID')
 * and unexpected programming errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
