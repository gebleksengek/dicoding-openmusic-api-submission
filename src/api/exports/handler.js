// @ts-check

const autoBind = require('auto-bind');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 */

class ExportsHandler {
  /**
   * @readonly
   * @private
   */
  _producerService;

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
   * @readonly
   * @private
   */
  _queueName = 'export:playlist';

  /**
   * @param {import('../../services/rabbitmq/ProducerService')} producerService
   * @param {IPlaylistsService} playlistsService
   * @param {import('../../validator/exports')} validator
   */
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postExportPlaylistHandler(request, h) {
    this._validator.ValidateExportPlaylist(request.payload);

    const { playlistId } = /** @type {{playlistId: string}} */ (request.params);
    const { targetEmail } = /** @type {{targetEmail: string}} */ (
      request.payload
    );
    const { userId } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    await this._playlistsService.verifyPlaylistOwner({
      owner: userId,
      id: playlistId,
    });

    const message = {
      targetEmail,
      playlistId,
    };

    await this._producerService.sendMessage(
      this._queueName,
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrian',
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportsHandler;
