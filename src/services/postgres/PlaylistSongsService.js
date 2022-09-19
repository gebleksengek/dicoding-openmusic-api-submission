// @ts-check

const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/PlaylistSongsServiceType').IPlaylistSongsService} IPlaylistSongsService
 * @typedef {import('../_types/CollaborationsServiceType').ICollaborationsService} ICollaborationsService
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
  _collaborationsService;

  /**
   * @param {ICollaborationsService} collaborationsService
   */
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  /**
   * @param {{playlistId: string, songId: string}} param0
   */
  async addPlaylistSong({ playlistId, songId }) {
    const id = this._prefixId + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // VALUES($1, $2, $3, $4, $5)
    const query = {
      text: `
          INSERT INTO ${this._tableName} 
          SELECT $1, $2, $3, $4, $5
          WHERE EXISTS (
            SELECT 1 from songs
            WHERE "deletedAt" IS NULL
            AND "id" = $6
          )
          RETURNING id
        `,
      values: [id, playlistId, songId, createdAt, updatedAt, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Song gagal ditambahkan ke playlist. Id song tidak ditemukan'
      );
    }

    return result.rows[0].id;
  }

  /**
   * @param {{playlistId: string, songId: string}} param0
   */
  async deletePlaylistSongById({ playlistId, songId }) {
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
  }
}

module.exports = PlaylistSongsService;
