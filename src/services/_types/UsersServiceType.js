// @ts-check

/**
 * User entity interface
 *
 * @typedef {object} IUserEntity
 * @property {string} username
 * @property {string} password
 * @property {string} fullname
 */

/**
 * Users Service interface
 *
 * @typedef {object} IUsersService
 * @property {function(string): Promise<void> | void} verifyNewUsername
 * @property {function(IUserEntity): Promise<string> | string} addUser
 * @property {function(string): Promise<any> | any} getUserById
 * @property {function(string,string): Promise<string> | string} verifyUserCredential
 */

module.exports = {};
