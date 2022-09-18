// @ts-check

const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

/**
 * @typedef {import('../../services/_types/AuthenticationsServiceType').IAuthenticationsService} IAuthenticationsService
 * @typedef {import('../../services/_types/UsersServiceType').IUsersService} IUsersService
 * @typedef {import('../../tokenize/TokenManager')} TokenManager
 * @typedef {import('../../validator/authentications')} AuthenticationsValidator
 */

/**
 * @typedef {object} IAuthenticationsPlugin
 * @property {IAuthenticationsService} authenticationsService
 * @property {IUsersService} usersService
 * @property {TokenManager} tokenManager
 * @property {AuthenticationsValidator} validator
 */

/**
 * @type {import('@hapi/hapi').Plugin<IAuthenticationsPlugin>}
 */
const authenticationHapiPlugin = {
  name: 'Authentication Plugin',
  version: '1.0.0',

  register: async (
    server,
    { authenticationsService, usersService, tokenManager, validator }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    );

    server.route(routes(authenticationsHandler));
  },
};

module.exports = authenticationHapiPlugin;
