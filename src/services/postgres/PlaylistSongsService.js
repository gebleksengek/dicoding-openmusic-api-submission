// @ts-check

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/PlaylistSongsServiceType').IPlaylistSongsService} IPlaylistSongsService
 * @typedef {import('../_types/PlaylistSongActivitiesServiceType').IPSAService} IPSAService
 */

/**
 * @implements {IPlaylistSongsService}
 */
class PlaylistSongsService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'playlist_songs';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'playlist_song-';

  /**
   * @readonly
   * @private
   */
  _psaService;

  /**
   * @param {IPSAService} psaService
   */
  constructor(psaService) {
    this._pool = new Pool();
    this._psaService = psaService;
  }

  /**
   * @param {{playlistId: string, songId: string, userId: string}} param0
   */
  async addPlaylistSong({ playlistId, songId, userId }) {
    const id = this._prefixId + nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
      text: `
          INSERT INTO ${this._tableName} 
          SELECT $1, $2, $3, $4, $4
          WHERE EXISTS (
            SELECT 1 FROM songs
            WHERE "deletedAt" IS NULL
            AND "id" = $5
          )
          RETURNING id
        `,
      values: [id, playlistId, songId, createdAt, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Song gagal ditambahkan ke playlist. Id song tidak ditemukan'
      );
    }

    await this._psaService.addActivity({
      playlistId,
      songId,
      userId,
      action: 'add',
    });

    return result.rows[0].id;
  }

  /**
   * @param {{playlistId: string, songId: string, userId: string}} param0
   */
  async deletePlaylistSongById({ playlistId, songId, userId }) {
    const query = {
      text: `
        DELETE FROM ${this._tableName}
        WHERE playlist_id = $1 AND song_id = $2
        RETURNING id
      `,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Song gagal dihapus dari playlist. Id song tidak ditemukan'
      );
    }

    await this._psaService.addActivity({
      playlistId,
      songId,
      userId,
      action: 'delete',
    });
  }
}

module.exports = PlaylistSongsService;
