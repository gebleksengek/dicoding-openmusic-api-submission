// @ts-check

const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/SongsServiceType').ISongEntity} ISongEntity
 * @typedef {import('../_types/SongsServiceType').ISongsService} ISongsService
 * @typedef {import('../_types/SongsServiceType').ISongsGetQuery} ISongsGetQuery
 */

/**
 * @implements {ISongsService}
 */
class SongsService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'songs';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'song-';

  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {ISongEntity} param0
   * @returns {Promise<string>}
   */
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = this._prefixId + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `
        INSERT INTO ${this._tableName} 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id
      `,
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * @param {ISongsGetQuery} param0
   * @returns {Promise<any>}
   */
  async getSongs({ title = '', performer = '' }) {
    const query = {
      text: `
        SELECT id,title,performer FROM ${this._tableName}
        WHERE "deletedAt" IS NULL
        AND LOWER(title) LIKE $1
        AND LOWER(performer) LIKE $2
      `,
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  /**
   * @param {string} id
   */
  async getSongById(id) {
    const query = {
      text: `
        SELECT id,title,year,performer,genre,duration,"albumId"
        FROM ${this._tableName} 
        WHERE "deletedAt" IS NULL
        AND id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * @param {string} id
   * @param {ISongEntity} param1
   */
  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `
        UPDATE ${this._tableName} 
        SET title = $1, year = $2, performer = $3, genre = $4, 
        duration = $5, "albumId" = $6, "updatedAt" = $7 
        WHERE "deletedAt" IS NULL
        AND id = $8
        RETURNING id
      `,
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  /**
   * @param {string} id
   */
  async deleteSongById(id) {
    const deletedAt = new Date().toISOString();

    const query = {
      // text: `DELETE FROM ${this._tableName} WHERE id = $1 RETURNING id`,
      text: `
        UPDATE ${this._tableName} 
        SET "deletedAt" = $1
        WHERE "deletedAt" IS NULL
        AND id = $2
        RETURNING id
      `,
      values: [deletedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
