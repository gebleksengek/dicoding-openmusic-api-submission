// @ts-check

const autoBind = require('auto-bind');

const { hapiErrorHandler } = require('../../utils/HapiErrorHandler');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 */

class PlaylistsHandler {
  /**
   * @readonly
   * @private
   */
  _service;

  /**
   * @readonly
   * @private
   */
  _validator;

  /**
   * @param {IPlaylistsService} service
   * @param {import('../../validator/playlists')} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postPlaylistHandler(request, h) {
    try {
      this._validator.validateCreatePlaylist(request.payload);

      const { name } = /** @type {{name: string}} */ (request.payload);
      const { userId: owner } = /** @type {{userId: string}} */ (
        request.auth.credentials
      );

      const playlistId = await this._service.addPlaylist({ owner, name });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);

      return response;
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async getPlaylistsHandler(request, h) {
    try {
      const { userId: owner } = /** @type {{userId: string}} */ (
        request.auth.credentials
      );

      const playlists = await this._service.getPlaylists({ owner });

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }
}

module.exports = PlaylistsHandler;
