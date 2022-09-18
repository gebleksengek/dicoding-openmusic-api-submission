// @ts-check

const AlbumsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/_types/AlbumsServiceType').IAlbumsService} IAlbumsService
 * @typedef {import('../../validator/albums')} AlbumsValidator
 */

/**
 * @typedef {object} IAlbumsPlugin
 * @property {IAlbumsService} service
 * @property {AlbumsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IAlbumsPlugin>}
 */
const albumHapiPlugin = {
  name: 'Album Plugin',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);

    server.route(routes(albumsHandler));
  },
};

module.exports = albumHapiPlugin;
