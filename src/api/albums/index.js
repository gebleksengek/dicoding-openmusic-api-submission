// @ts-check

const AlbumsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/_types/AlbumsServiceType').IAlbumsService} IAlbumsService
 * @typedef {import('../../services/_types/UserAlbumLikesType').IUserAlbumLikes} IUserAlbumLikes
 * @typedef {import('../../services/storage/StorageService')} StorageService
 * @typedef {import('../../services/redis/CacheService')} CacheService
 * @typedef {import('../../validator/albums')} AlbumsValidator
 */

/**
 * @typedef {object} IAlbumsPlugin
 * @property {IAlbumsService} albumsService
 * @property {IUserAlbumLikes} ualService
 * @property {StorageService} storageService
 * @property {CacheService} cacheService
 * @property {AlbumsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IAlbumsPlugin>}
 */
const albumHapiPlugin = {
  name: 'Album Plugin',
  version: '1.0.0',

  register: async (
    server,
    { albumsService, ualService, storageService, cacheService, validator }
  ) => {
    const albumsHandler = new AlbumsHandler(
      albumsService,
      ualService,
      storageService,
      cacheService,
      validator
    );

    server.route(routes(albumsHandler));
  },
};

module.exports = albumHapiPlugin;
