// @ts-check

const AlbumsHandler = require('./handler');
const albumRoutes = require('./routes');

/**
 * @typedef {import('../../services/_types/AlbumsServiceType').IAlbumsService} IAlbumsService
 * @typedef {import('../../validator/albums')} AlbumValidator
 */

/**
 * @typedef {object} IAlbumsPlugin
 * @property {IAlbumsService} service
 * @property {AlbumValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IAlbumsPlugin>}
 */
const albumHapiPlugin = {
  name: 'Album Plugin',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    server.route(albumRoutes(new AlbumsHandler(service, validator)));
  },
};

module.exports = albumHapiPlugin;
