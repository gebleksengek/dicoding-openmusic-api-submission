// @ts-check

const autoBind = require('auto-bind');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/UsersServiceType').IUserEntity} IUserEntity
 * @typedef {import('../../services/_types/UsersServiceType').IUsersService} IUsersService
 */

class UsersHandler {
  /**
   * @readonly
   * @private
   */
  _service;

  /**
   * @readonly
   * @private
   */
  _validator;

  /**
   * @param {IUsersService} service
   * @param {import('../../validator/users')} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = /** @type {IUserEntity} */ (
      request.payload
    );

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   */
  async getUserByIdHandler(request) {
    const { id } = /** @type {{id: string}} */ (request.params);

    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
