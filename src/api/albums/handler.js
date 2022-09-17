// @ts-check

const autoBind = require('auto-bind');

const { hapiErrorHandler } = require('../../utils/HapiErrorHandler');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/AlbumsServiceType').IAlbumEntity} IAlbumEntity
 * @typedef {import('../../services/_types/AlbumsServiceType').IAlbumsService} IAlbumsService
 */

class AlbumsHandler {
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
   * @param {IAlbumsService} service
   * @param {import('../../validator/albums')} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  /**
   *
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { name, year } = /** @type {IAlbumEntity} */ (request.payload);
      const albumId = await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
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
  async getAlbumById(request, h) {
    try {
      const { id } = /** @type {{id: string}} */ (request.params);

      const album = await this._service.getAlbumById(id);

      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async putAlbumByid(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = /** @type {{id: string}} */ (request.params);
      const { name, year } = /** @type {IAlbumEntity} */ (request.payload);

      await this._service.editAlbumById(id, { name, year });

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async deleteAlbumById(request, h) {
    try {
      const { id } = /** @type {{id: string}} */ (request.params);

      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }
}

module.exports = AlbumsHandler;
