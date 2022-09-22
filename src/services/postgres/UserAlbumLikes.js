// @ts-check

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/UserAlbumLikesType').IUserAlbumLikes} IUserAlbumLikes
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
  _tableName = 'user_album_likes';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'ual-';

  constructor() {
    this._pool = new Pool();
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
   */
  async getAlbumTotalLikes(albumId) {
    const query = {
      text: `
        SELECT id
        FROM ${this._tableName}
        WHERE album_id = $1
      `,
      values: [albumId],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }
}

module.exports = UALService;
