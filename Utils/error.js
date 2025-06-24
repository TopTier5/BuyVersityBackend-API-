/**
 * Custom Error Class
 * Extends the built-in Error class to include a status code
 * and an 'isOperational' flag for distinguishing between trusted
 * operational errors and programming errors.
 */
export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational error (errors we expect and can handle)

    // Capture stack trace for better debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handling Middleware
 * This middleware catches any errors passed to next() in the application.
 * It sends a standardized JSON error response.
 */
export const connect = (err, req, res, next) => {
  // Log the error for debugging purposes (especially the stack in development)
  console.error(err.stack);

  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  // Send a standardized JSON error response
  res.status(statusCode).json({
    success: false,
    message: message,
    // Include stack trace only in development environment for security
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};