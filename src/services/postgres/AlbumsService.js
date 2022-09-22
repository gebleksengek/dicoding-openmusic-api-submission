// @ts-check

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

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

    const query = {
      text: `
        INSERT INTO ${this._tableName} 
        VALUES($1, $2, $3, $4, $4) 
        RETURNING id
      `,
      values: [id, name, year, createdAt],
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
        SELECT a.id, a.name, a.year, cover as "coverUrl", COALESCE(
          json_agg(
            json_build_object(
              'id', s.id, 
              'title', s.title, 
              'performer', s.performer
            )
          ) FILTER (
            WHERE s.id IS NOT NULL
            AND s."deletedAt" IS NULL
          ),
        '[]') as songs
        FROM ${this._tableName} a
        LEFT JOIN songs s ON a.id = "albumId" 
        WHERE a.id = $1
        GROUP BY a.id
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
        WHERE id = $4 
        RETURNING id
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
   * @param {string} filename
   */
  async editAlbumCoverById(id, filename) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `
        UPDATE ${this._tableName}
        SET cover = $1, "updatedAt" = $2
        WHERE id = $3
        RETURNING id
      `,
      values: [filename, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Gagal memperbarui cover album. Id tidak ditemukan'
      );
    }
  }

  /**
   * @param {string} id
   */
  async deleteAlbumById(id) {
    const query = {
      text: `
        DELETE FROM ${this._tableName} 
        WHERE id = $1 
        RETURNING id
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
