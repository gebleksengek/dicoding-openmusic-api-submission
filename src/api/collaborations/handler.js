// @ts-check

const autoBind = require('auto-bind');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/CollaborationsServiceType').ICollaborationsService} ICollaborationsService
 * @typedef {import('../../services/_types/CollaborationsServiceType').ICollaborationEntity} ICollaborationEntity
 * @typedef {import('../../validator/collaborations')} CollaborationsValidator
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 */

class CollaborationsHandler {
  /**
   * @readonly
   * @private
   */
  _collaborationsService;

  /**
   * @readonly
   * @private
   */
  _playlistsService;

  /**
   * @readonly
   * @private
   */
  _validator;

  /**
   * @param {ICollaborationsService} collaborationsService
   * @param {IPlaylistsService} playlistsService
   * @param {CollaborationsValidator} validator
   */
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaboration(request.payload);

    const { playlistId, userId } = /** @type {ICollaborationEntity} */ (
      request.payload
    );
    const { userId: owner } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    await this._playlistsService.verifyPlaylistAccess({
      playlistId,
      userId: owner,
    });
    const collaborationId = await this._collaborationsService.addCollaboration({
      playlistId,
      userId,
    });

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   */
  async deleteCollaborationHandler(request) {
    this._validator.validatePostCollaboration(request.payload);

    const { playlistId, userId } = /** @type {ICollaborationEntity} */ (
      request.payload
    );
    const { userId: owner } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    await this._playlistsService.verifyPlaylistOwner({
      owner,
      id: playlistId,
    });
    await this._collaborationsService.deleteCollaboration({
      playlistId,
      userId,
    });

    return {
      status: 'success',
      message: 'Collaborator berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
