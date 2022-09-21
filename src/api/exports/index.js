// @ts-check

const ExportsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/rabbitmq/ProducerService')} ProducerService
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 * @typedef {import('../../validator/exports')} ExportsValidator
 */

/**
 * @typedef {object} IExportsPlugin
 * @property {ProducerService} producerService
 * @property {IPlaylistsService} playlistsService
 * @property {ExportsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IExportsPlugin>}
 */
const exportHapiPlugin = {
  name: 'Exports Plugin',
  version: '1.0.0',

  register: async (
    server,
    { producerService, playlistsService, validator }
  ) => {
    const exportsHandler = new ExportsHandler(
      producerService,
      playlistsService,
      validator
    );

    server.route(routes(exportsHandler));
  },
};

module.exports = exportHapiPlugin;
