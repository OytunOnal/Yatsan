export class InvalidResetTokenError extends Error {
  constructor(message = 'Invalid reset token') {
    super(message);
    this.name = 'InvalidResetTokenError';
  }
}

export class ResetTokenExpiredError extends Error {
  constructor(message = 'Reset token has expired') {
    super(message);
    this.name = 'ResetTokenExpiredError';
  }
}

export class TooManyResetRequestsError extends Error {
  constructor(message = 'Too many reset requests') {
    super(message);
    this.name = 'TooManyResetRequestsError';
  }
}