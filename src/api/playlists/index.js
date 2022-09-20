// @ts-check

const PlaylistsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 * @typedef {import('../../services/_types/PlaylistSongsServiceType').IPlaylistSongsService} IPlaylistSongsService
 * @typedef {import('../../services/_types/PlaylistSongActivitiesServiceType').IPSAService} IPSAService
 * @typedef {import('../../validator/playlists')} PlaylistsValidator
 */

/**
 * @typedef {object} IPlaylistsPlugin
 * @property {IPlaylistsService} playlistsService
 * @property {IPlaylistSongsService} playlistSongsService
 * @property {IPSAService} psaService
 * @property {PlaylistsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IPlaylistsPlugin>}
 */
const playlistHapiPlugin = {
  name: 'Playlist Plugin',
  version: '1.0.0',

  register: async (
    server,
    { playlistsService, playlistSongsService, psaService, validator }
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      playlistSongsService,
      psaService,
      validator
    );

    server.route(routes(playlistsHandler));
  },
};

module.exports = playlistHapiPlugin;
