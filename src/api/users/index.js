// @ts-check

const routes = require('./routes');
const UsersHandler = require('./handler');

/**
 * @typedef {import('../../services/_types/UsersServiceType').IUsersService} IUsersService
 * @typedef {import('../../validator/users')} UsersValidator
 */

/**
 * @typedef {object} IUsersPlugin
 * @property {IUsersService} service
 * @property {UsersValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IUsersPlugin>}
 */
const userHapiPlugin = {
  name: 'User Plugin',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    const usersHandler = new UsersHandler(service, validator);

    server.route(routes(usersHandler));
  },
};

module.exports = userHapiPlugin;
