// @ts-check

const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'Invariant Error';
  }
}

module.exports = InvariantError;
