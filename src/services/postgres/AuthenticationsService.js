// @ts-check

const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

/**
 * @typedef {import('../_types/AuthenticationsServiceType').IAuthenticationsService} IAuthenticationsService
 */

/**
 * @implements {IAuthenticationsService}
 */
class AuthenticationsService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'authentications';

  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {string} token
   */
  async addRefreshToken(token) {
    const query = {
      text: `INSERT INTO ${this._tableName} VALUES($1)`,
      values: [token],
    };

    await this._pool.query(query);
  }

  /**
   * @param {string} token
   */
  async verifyRefreshToken(token) {
    const query = {
      text: `SELECT token FROM ${this._tableName} WHERE token = $1`,
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  /**
   * @param {string} token
   */
  async deleteRefreshToken(token) {
    const query = {
      text: `DELETE FROM ${this._tableName} WHERE token = $1`,
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
