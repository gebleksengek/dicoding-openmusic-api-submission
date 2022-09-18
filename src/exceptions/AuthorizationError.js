// @ts-check

const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  /** @param {string} message */
  constructor(message) {
    super(message, 403);
    this.name = 'Authorization Error';
  }
}

module.exports = AuthorizationError;
