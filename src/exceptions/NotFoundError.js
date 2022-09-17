// @ts-check

const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  /** @param {string} message */
  constructor(message) {
    super(message, 404);
    this.name = 'Not Found Error';
  }
}

module.exports = NotFoundError;
