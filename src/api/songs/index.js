// @ts-check

const SongsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/_types/SongsServiceType').ISongsService} ISongsService
 * @typedef {import('../../validator/songs')} SongsValidator
 */

/**
 * @typedef {object} ISongsPlugin
 * @property {ISongsService} service
 * @property {SongsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<ISongsPlugin>}
 */
const songHapiPlugin = {
  name: 'Song Plugin',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);

    server.route(routes(songsHandler));
  },
};

module.exports = songHapiPlugin;
