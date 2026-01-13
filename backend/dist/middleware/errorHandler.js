"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
const zod_1 = require("zod");
/**
 * Custom Application Error
 */
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
/**
 * Validation Error
 */
class ValidationError extends AppError {
    constructor(errors) {
        super('Validation failed', 400);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
/**
 * Not Found Error
 */
class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Unauthorized Error
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * Forbidden Error
 */
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // Handle custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
        });
    }
    // Default error response
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
};
exports.errorHandler = errorHandler;
/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
