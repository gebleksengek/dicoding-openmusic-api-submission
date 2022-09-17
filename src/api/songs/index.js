// @ts-check

const SongsHandler = require('./handler');
const songRoutes = require('./routes');

/**
 * @typedef {import('../../services/_types/SongsServiceType').ISongsService} ISongsService
 * @typedef {import('../../validator/songs')} SongValidator
 */

/**
 * @typedef {object} ISongsPlugin
 * @property {ISongsService} service
 * @property {SongValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<ISongsPlugin>}
 */
const songHapiPlugin = {
  name: 'Song Plugin',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    server.route(songRoutes(new SongsHandler(service, validator)));
  },
};

module.exports = songHapiPlugin;
