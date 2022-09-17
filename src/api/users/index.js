// @ts-check

const UsersHandler = require('./handler');
const userRoutes = require('./routes');

/**
 * @typedef {import('../../services/_types/UsersServiceType').IUsersService} IUsersService
 * @typedef {import('../../validator/users')} UserValidator
 */

/**
 * @typedef {object} IUsersPlugin
 * @property {IUsersService} service
 * @property {UserValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IUsersPlugin>}
 */
const userHapiPlugin = {
  name: 'User Plugin',
  version: '1.0.0',

  register: async (server, { service, validator }) => {
    server.route(userRoutes(new UsersHandler(service, validator)));
  },
};

module.exports = userHapiPlugin;
