// @ts-check

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/PlaylistSongActivitiesServiceType').IPSAService} IPSAService
 * @typedef {import('../_types/PlaylistSongActivitiesServiceType').IActivityParam} IActivityParam
 */

/**
 * @implements {IPSAService}
 */
class PSAService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'playlist_song_activities';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'psa-';

  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {IActivityParam} param0
   */
  async addActivity({ playlistId, songId, userId, action }) {
    const id = this._prefixId + nanoid(16);

    const query = {
      text: `
        INSERT INTO ${this._tableName}
        VALUES($1, $2, $3, $4, $5)
        RETURNING id
      `,
      values: [id, playlistId, songId, userId, action],
    };

    await this._pool.query(query);
  }

  /**
   * @param {{playlistId: string}} param0
   */
  async getActivitiesByPlaylistId({ playlistId }) {
    const query = {
      text: `
        SELECT u.username, s.title, psa.action, psa.time
        FROM ${this._tableName} psa
        LEFT JOIN users u ON psa.user_id = u.id
        LEFT JOIN songs s ON psa.song_id = s.id
        WHERE psa.playlist_id = $1
        ORDER BY psa.time ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = PSAService;
