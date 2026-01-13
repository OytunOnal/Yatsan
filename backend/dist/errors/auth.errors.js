"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyResetRequestsError = exports.ResetTokenExpiredError = exports.InvalidResetTokenError = void 0;
class InvalidResetTokenError extends Error {
    constructor(message = 'Invalid reset token') {
        super(message);
        this.name = 'InvalidResetTokenError';
    }
}
exports.InvalidResetTokenError = InvalidResetTokenError;
class ResetTokenExpiredError extends Error {
    constructor(message = 'Reset token has expired') {
        super(message);
        this.name = 'ResetTokenExpiredError';
    }
}
exports.ResetTokenExpiredError = ResetTokenExpiredError;
class TooManyResetRequestsError extends Error {
    constructor(message = 'Too many reset requests') {
        super(message);
        this.name = 'TooManyResetRequestsError';
    }
}
exports.TooManyResetRequestsError = TooManyResetRequestsError;
