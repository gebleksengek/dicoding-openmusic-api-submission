// @ts-check

class ClientError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'Client Error';
  }
}

module.exports = ClientError;
