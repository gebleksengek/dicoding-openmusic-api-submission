// @ts-check

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const config = require('./utils/config');

const albumHapiPlugin = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const authenticationsHapiPlugin = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

const collaborationHapiPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const exportHapiPlugin = require('./api/exports');
const ExportsValidator = require('./validator/exports');

const playlistHapiPlugin = require('./api/playlists');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const ProducerService = require('./services/rabbitmq/ProducerService');

const PSAService = require('./services/postgres/PlaylistSongActivitiesService');

const songHapiPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const userHapiPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const { hapiErrorHandler } = require('./utils/HapiErrorHandler');

const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const psaService = new PSAService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService(psaService);

  await server.register(Jwt);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: config.jwtToken.access_token_key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwtToken.access_token_age,
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: {
          userId: artifacts.decoded.payload.userId,
        },
      };
    },
  });

  await server.register([
    {
      plugin: albumHapiPlugin,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songHapiPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: userHapiPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authenticationsHapiPlugin,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlistHapiPlugin,
      options: {
        playlistsService,
        playlistSongsService,
        psaService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborationHapiPlugin,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportHapiPlugin,
      options: {
        playlistsService,
        producerService: ProducerService,
        validator: ExportsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    if (request.response instanceof Error) {
      return hapiErrorHandler(h, request.response);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
