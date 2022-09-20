// @ts-check

const CollaborationsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/_types/CollaborationsServiceType').ICollaborationsService} ICollaborationsService
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 * @typedef {import('../../validator/collaborations')} CollaborationsValidator
 */

/**
 * @typedef {object} ICollaborationsPlugin
 * @property {ICollaborationsService} collaborationsService
 * @property {IPlaylistsService} playlistsService
 * @property {CollaborationsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<ICollaborationsPlugin>}
 */
const collaborationHapiPlugin = {
  name: 'Collaborations Plugin',
  version: '1.0.0',

  register: async (
    server,
    { collaborationsService, playlistsService, validator }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      validator
    );

    server.route(routes(collaborationsHandler));
  },
};

module.exports = collaborationHapiPlugin;
