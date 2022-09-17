// @ts-check

const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/AlbumsServiceType').IAlbumEntity} IAlbumEntity
 * @typedef {import('../_types/AlbumsServiceType').IAlbumsService} IAlbumsService
 */

/**
 * @implements {IAlbumsService}
 */
class AlbumsService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'albums';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'album-';

  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {IAlbumEntity} param0
   * @returns {Promise<string>}
   */
  async addAlbum({ name, year }) {
    const id = this._prefixId + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO ${this._tableName} VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * @returns {Promise<Array<any>>}
   */
  async getAlbums() {
    return [];
  }

  /**
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getAlbumById(id) {
    const query = {
      text: `
        SELECT albums.id, albums.name, albums.year, COALESCE(
          json_agg(
            json_build_object('id', songs.id, 'title', songs.title, 'performer', songs.performer)
          ) FILTER (WHERE songs.id IS NOT NULL),
        '[]') as songs
        FROM ${this._tableName} LEFT JOIN songs ON albums.id = "albumId" 
        WHERE albums.id = $1 GROUP BY 1,2,3
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * @param {string} id
   * @param {IAlbumEntity} param1
   */
  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `
        UPDATE ${this._tableName} 
        SET name = $1, year = $2, "updatedAt" = $3 
        WHERE id = $4 RETURNING id
      `,
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  /**
   * @param {string} id
   */
  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${this._tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
