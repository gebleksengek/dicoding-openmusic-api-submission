// @ts-check

const autoBind = require('auto-bind');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/SongsServiceType').ISongEntity} ISongEntity
 * @typedef {import('../../services/_types/SongsServiceType').ISongsService} ISongsService
 * @typedef {import('../../services/_types/SongsServiceType').ISongsGetQuery} ISongsGetQuery
 */

class SongsHandler {
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
   *
   * @param {ISongsService} service
   * @param {import('../../validator/songs')} validator
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
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(
      /** @type {ISongEntity} */ (request.payload)
    );

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   */
  async getSongsHandler(request) {
    const { title, performer } = /** @type {ISongsGetQuery} */ (request.query);

    const songs = await this._service.getSongs({ title, performer });

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /**
   * @param {Request} request
   */
  async getSongByIdHandler(request) {
    const { id } = /** @type {{id: string}} */ (request.params);

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  /**
   * @param {Request} request
   */
  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = /** @type {{id:string}} */ (request.params);

    await this._service.editSongById(
      id,
      /** @type {ISongEntity} */ (request.payload)
    );

    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  /**
   * @param {Request} request
   */
  async deleteAlbumByIdHandler(request) {
    const { id } = /** @type {{id: string}} */ (request.params);

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
