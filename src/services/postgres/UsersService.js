// @ts-check

const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const AuthenticationError = require('../../exceptions/AuthenticationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/UsersServiceType').IUserEntity} IUserEntity
 * @typedef {import('../_types/UsersServiceType').IUsersService} IUsersService
 */

/**
 * @implements {IUsersService}
 */
class UsersService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'users';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'user-';

  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {string} username
   */
  async verifyNewUsername(username) {
    const query = {
      text: `
        SELECT username 
        FROM ${this._tableName} 
        WHERE username = $1
      `,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(
        'Gagal menambahkan User. Username sudah digunakan.'
      );
    }
  }

  /**
   * @param {IUserEntity} param0
   * @returns {Promise<string>}
   */
  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = this._prefixId + nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `
        INSERT INTO ${this._tableName} 
        VALUES($1, $2, $3, $4) 
        RETURNING id
      `,
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getUserById(id) {
    const query = {
      text: `
        SELECT id, username, fullname 
        FROM ${this._tableName} 
        WHERE id = $id
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async verifyUserCredential(username, password) {
    const query = {
      text: `
        SELECT id, password 
        FROM ${this._tableName} 
        WHERE username = $1
      `,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Kredential yang anda berikan salah');
    }

    const { id, password: hashedPassword } =
      /** @type {{id: string, password: string}} */ (result.rows[0]);

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredential yang anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersService;
