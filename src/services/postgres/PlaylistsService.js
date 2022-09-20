// @ts-check

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const AuthroizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 * @typedef {import('../_types/CollaborationsServiceType').ICollaborationsService} ICollaborationsService
 */

/**
 * @implements {IPlaylistsService}
 */
class PlaylistsService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'playlists';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'playlist-';

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
   * @param {{owner: string, name: string}} param0
   */
  async addPlaylist({ owner, name }) {
    const id = this._prefixId + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO ${this._tableName} VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * @param {{owner: string}} param0
   */
  async getPlaylists({ owner }) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username 
        FROM ${this._tableName} p
        LEFT JOIN users u ON p.owner = u.id
        LEFT JOIN collaborations c ON c.playlist_id = p.id
        WHERE p.owner = $1
        OR c.user_id = $1
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  /**
   * @param {{id: string}} param0
   */
  async getPlaylistById({ id }) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username, COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'title', s.title,
              'performer', s.performer
            )
          ) FILTER (
            WHERE s."deletedAt" IS NULL
            AND s."id" IS NOT NULL
            ),
        '[]') as songs
        FROM ${this._tableName} p
        LEFT JOIN users u ON p.owner = u.id
        LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
        LEFT JOIN songs s ON s.id = ps.song_id
        WHERE p.id = $1 GROUP BY 1,2,3
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   *
   * @param {{id: string}} param0
   */
  async deletePlaylistById({ id }) {
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
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * @param {{id: string, owner: string}} param0
   */
  async verifyPlaylistOwner({ id, owner }) {
    const query = {
      text: `SELECT owner FROM ${this._tableName} WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = /** @type {{owner: string}} */ (result.rows[0]);

    if (playlist.owner !== owner) {
      throw new AuthroizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  /**
   *
   * @param {{playlistId: string, userId: string}} param0
   */
  async verifyPlaylistAccess({ playlistId, userId }) {
    try {
      await this.verifyPlaylistOwner({ id: playlistId, owner: userId });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaboration({
          playlistId,
          userId,
        });
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
