// @ts-check

require('dotenv').config();

const Hapi = require('@hapi/hapi');

const albumHapiPlugin = require('./api/albums');
const songHapiPlugin = require('./api/songs');
const userHapiPlugin = require('./api/users');

const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/songs');
const UserValidator = require('./validator/users');

const init = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  await server.register([
    {
      plugin: albumHapiPlugin,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songHapiPlugin,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: userHapiPlugin,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
