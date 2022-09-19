// @ts-check

const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

/**
 * @typedef {import('../_types/CollaborationsServiceType').ICollaborationsService} ICollaborationsService
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
   * @param {{playlistId: string, userId: string}}  param0
   */
  async addCollaboration({ playlistId, userId }) {
    return '';
  }

  /**
   *
   * @param {{playlistId: string, userId: string}} param0
   */
  async deleteCollaboration({ playlistId, userId }) {
    console.log(1);
  }

  /**
   * @param {{playlistId: string, userId: string}} param0
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
