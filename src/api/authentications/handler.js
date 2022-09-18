// @ts-check

const autoBind = require('auto-bind');

const { hapiErrorHandler } = require('../../utils/HapiErrorHandler');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/AuthenticationsServiceType').IAuthenticationsService} IAuthenticationsService
 * @typedef {import('../../services/_types/UsersServiceType').IUsersService} IUsersService
 * @typedef {import('../../tokenize/TokenManager')} TokenManager
 * @typedef {import('../../validator/authentications')} AuthenticationsValidator
 */

class AuthenticationsHandler {
  /**
   * @readonly
   * @private
   */
  _authenticationsService;

  /**
   * @readonly
   * @private
   */
  _usersService;

  /**
   * @readonly
   * @private
   */
  _tokenManager;

  /**
   * @readonly
   * @private
   */
  _validator;

  /**
   * @param {IAuthenticationsService} authenticationsService
   * @param {IUsersService} usersService
   * @param {TokenManager} tokenManager
   * @param {AuthenticationsValidator} validator
   */
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthentication(request.payload);

      const { username, password } =
        /** @type {{username: string, password: string}} */ (request.payload);

      const userId = await this._usersService.verifyUserCredential(
        username,
        password
      );

      const accessToken = this._tokenManager.generateAccessToken({ userId });
      const refreshToken = this._tokenManager.generateRefreshToken({ userId });

      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication behasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);

      return response;
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthencation(request.payload);

      const { refreshToken } = /** @type {{refreshToken: string}} */ (
        request.payload
      );
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ userId });

      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthentication(request.payload);

      const { refreshToken } = /** @type {{refreshToken: string}} */ (
        request.payload
      );
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      return hapiErrorHandler(h, error);
    }
  }
}

module.exports = AuthenticationsHandler;
