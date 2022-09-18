// @ts-check

const PlaylistsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 * @typedef {import('../../validator/playlists')} PlaylistsValidator
 */

/**
 * @typedef {object} IPlaylistsPlugin
 * @property {IPlaylistsService} service
 * @property {PlaylistsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IPlaylistsPlugin>}
 */
const playlistHapiPlugin = {
  name: 'Playlist Plugin',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator);

    server.route(routes(playlistsHandler));
  },
};

module.exports = playlistHapiPlugin;
