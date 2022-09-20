// @ts-check

/**
 * @typedef {object} ICollaborationEntity
 * @property {string} playlistId
 * @property {string} userId
 */

/**
 * @typedef {object} ICollaborationsService
 * @property {function(ICollaborationEntity): Promise<string> | string} addCollaboration
 * @property {function(ICollaborationEntity): Promise<void> | void} deleteCollaboration
 * @property {function(ICollaborationEntity): Promise<void> | void} verifyCollaboration
 */

module.exports = {};
