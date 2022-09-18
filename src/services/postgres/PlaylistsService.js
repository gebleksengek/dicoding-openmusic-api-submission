// @ts-check

const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const AuthroizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
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

  constructor() {
    this._pool = new Pool();
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
        SELECT playlists.id, playlists.name, users.username FROM ${this._tableName}
        JOIN users ON playlists.owner = users.id
        WHERE playlists.owner = $1
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  /**
   * @param {{playlistId: string, owner: string}} param0
   */
  async verifyPlaylistOwner({ playlistId, owner }) {
    const query = {
      text: `SELECT owner FROM ${this._tableName} WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = /** @type {{onwer: string}} */ (result.rows[0]);

    if (playlist.onwer !== owner) {
      throw new AuthroizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
