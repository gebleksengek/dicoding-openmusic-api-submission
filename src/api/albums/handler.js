// @ts-check

const autoBind = require('auto-bind');

const config = require('../../utils/config');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/AlbumsServiceType').IAlbumEntity} IAlbumEntity
 * @typedef {import('../../services/_types/AlbumsServiceType').IAlbumsService} IAlbumsService
 * @typedef {import('../../services/_types/UserAlbumLikesType').IUserAlbumLikes} IUserAlbumLikes
 * @typedef {import('../../services/storage/StorageService')} StorageService
 * @typedef {import('../../services/redis/CacheService')} CacheService
 */

class AlbumsHandler {
  /**
   * @readonly
   * @private
   */
  _albumsService;

  /**
   * @readonly
   * @private
   */
  _ualService;

  /**
   * @readonly
   * @private
   */
  _storageService;

  /**
   * @readonly
   * @private
   */
  _cacheService;

  /**
   * @readonly
   * @private
   */
  _validator;

  /**
   * @param {IAlbumsService} albumsService
   * @param {IUserAlbumLikes} ualService
   * @param {StorageService} storageService
   * @param {CacheService} cacheService
   * @param {import('../../validator/albums')} validator
   */
  constructor(
    albumsService,
    ualService,
    storageService,
    cacheService,
    validator
  ) {
    this._albumsService = albumsService;
    this._ualService = ualService;
    this._storageService = storageService;
    this._cacheService = cacheService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = /** @type {IAlbumEntity} */ (request.payload);

    const albumId = await this._albumsService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = /** @type {{cover: object}} */ (request.payload);
    const { id } = /** @type {{id: string}} */ (request.params);
    this._validator.validateAlbumCoverHeader(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._albumsService.editAlbumCoverById(
      id,
      `http://${config.app.host}:${config.app.port}/albums/covers/${filename}`
    );

    const response = h.response({
      status: 'success',
      message: 'Cover album berhasil diupload',
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   */
  async getAlbumByIdHandler(request) {
    const { id } = /** @type {{id: string}} */ (request.params);

    const album = await this._albumsService.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  /**
   * @param {Request} request
   */
  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = /** @type {{id: string}} */ (request.params);
    const { name, year } = /** @type {IAlbumEntity} */ (request.payload);

    await this._albumsService.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  /**
   * @param {Request} request
   */
  async deleteAlbumByIdHandler(request) {
    const { id } = /** @type {{id: string}} */ (request.params);

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postAlbumLikeOrUnlikeByIdHandler(request, h) {
    const { id } = /** @type {{id: string}} */ (request.params);
    const { userId } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    const action = await this._ualService.likeOrUnlikeAlbum({
      albumId: id,
      userId,
    });

    await this._cacheService.delete(`album:${id}`);

    const response = h.response({
      status: 'success',
      message: `Album berhasil ${action}`,
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async getAlbumTotalLikesByIdHandler(request, h) {
    const { id } = /** @type {{id: string}} */ (request.params);
    const cacheKey = `album:${id}`;

    let likes = 0;

    try {
      const result = await this._cacheService.get(cacheKey);

      likes = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', 'cache');

      return response;
    } catch {
      likes = await this._ualService.getAlbumTotalLikes(id);

      await this._cacheService.set(cacheKey, JSON.stringify(likes));

      return {
        status: 'success',
        data: {
          likes,
        },
      };
    }
  }
}

module.exports = AlbumsHandler;
