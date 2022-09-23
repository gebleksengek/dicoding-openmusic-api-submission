// @ts-check

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/UserAlbumLikesType').IUserAlbumLikes} IUserAlbumLikes
 * @typedef {import('../redis/CacheService')} CacheService
 */

/**
 * @implements {IUserAlbumLikes}
 */
class UALService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _cacheService;

  /**
   * @readonly
   * @private
   */
  _tableName = 'user_album_likes';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'ual-';

  /**
   * @param {CacheService} cacheService
   */
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  /**
   * @param {{albumId: string, userId: string}} param0
   */
  async likeOrUnlikeAlbum({ albumId, userId }) {
    try {
      const id = this._prefixId + nanoid(16);

      let result = await this._pool.query({
        text: `
          INSERT INTO ${this._tableName}
          SELECT $1, $2, $3
          WHERE NOT EXISTS (
            SELECT 1 FROM ${this._tableName}
            WHERE user_id = $4
            AND album_id = $5
          )
          RETURNING TRUE
        `,
        values: [id, userId, albumId, userId, albumId],
      });

      if (!result.rowCount) {
        result = await this._pool.query({
          text: `
            DELETE FROM ${this._tableName}
            WHERE user_id = $1
            AND album_id = $2
            RETURNING FALSE
          `,
          values: [userId, albumId],
        });

        if (!result.rowCount) {
          throw new InvariantError('error');
        }
      }

      await this._cacheService.delete(`${this._tableName}:${albumId}`);

      return result.rows[0].bool ? 'like' : 'unlike';
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundError(
          'Gagal like/unlike album. Album id tidak ditemukan.'
        );
      }

      throw new InvariantError(error.message);
    }
  }

  /**
   * @param {string} albumId
   * @returns {Promise<{cached: boolean, count: number}>}
   */
  async getAlbumTotalLikes(albumId) {
    const cacheKey = `${this._tableName}:${albumId}`;

    let cached = false;
    let count = 0;

    try {
      const result = await this._cacheService.get(cacheKey);

      count = JSON.parse(result).count;
      cached = true;
    } catch {
      const query = {
        text: `
        SELECT id
        FROM ${this._tableName}
        WHERE album_id = $1
      `,
        values: [albumId],
      };

      const { rowCount } = await this._pool.query(query);

      await this._cacheService.set(
        cacheKey,
        JSON.stringify({ count: rowCount })
      );

      count = rowCount;
    }

    return {
      cached,
      count,
    };
  }
}

module.exports = UALService;
