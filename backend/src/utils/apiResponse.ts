/**
 * @summary
 * Creates a standardized success response object.
 * @param data The payload to be returned.
 * @param metadata Optional metadata, e.g., for pagination.
 */
export const successResponse = <T>(data: T, metadata?: object) => {
  return {
    success: true,
    data,
    ...(metadata && { metadata }),
  };
};

/**
 * @summary
 * Creates a standardized error response object.
 * @param message A descriptive error message.
 * @param details Optional additional details about the error.
 */
export const errorResponse = (message: string, details?: object) => {
  return {
    success: false,
    error: {
      message,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
  };
};
