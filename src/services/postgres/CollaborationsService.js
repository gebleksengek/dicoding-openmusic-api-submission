// @ts-check

const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * @typedef {import('../_types/CollaborationsServiceType').ICollaborationsService} ICollaborationsService
 * @typedef {import('../_types/CollaborationsServiceType').ICollaborationEntity} ICollaborationEntity
 */

/**
 * @implements {ICollaborationsService}
 */
class CollaborationsService {
  /**
   * @readonly
   * @private
   */
  _pool;

  /**
   * @readonly
   * @private
   */
  _tableName = 'collaborations';

  /**
   * @readonly
   * @private
   */
  _prefixId = 'collab-';

  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {ICollaborationEntity}  param0
   */
  async addCollaboration({ playlistId, userId }) {
    const id = this._prefixId + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `
        INSERT INTO ${this._tableName}
        SELECT $1, $2, $3, $4, $5
        WHERE EXISTS (
          SELECT 1 FROM users
          WHERE "id" = $6
        )
        RETURNING id
      `,
      values: [id, playlistId, userId, createdAt, updatedAt, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Collaboration gagal ditambahkan. Id user tidak ditemukan'
      );
    }

    return result.rows[0].id;
  }

  /**
   *
   * @param {ICollaborationEntity} param0
   */
  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: `
        DELETE FROM ${this._tableName}
        WHERE playlist_id = $1
        AND user_id = $2
        RETURNING id
      `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Collaboration gagal dihapus.');
    }
  }

  /**
   * @param {ICollaborationEntity} param0
   */
  async verifyCollaboration({ playlistId, userId }) {
    const query = {
      text: `
        SELECT id FROM ${this._tableName}
        WHERE playlist_id = $1
        AND user_id = $2
      `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverfikasi');
    }
  }
}

module.exports = CollaborationsService;
