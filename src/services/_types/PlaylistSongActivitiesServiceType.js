// @ts-check

/**
 * @typedef {object} IActivityParam
 * @property {string} playlistId
 * @property {string} songId
 * @property {string} userId
 * @property {'add'|'delete'} action
 */

/**
 * @typedef {object} IPSAService
 * @property {function(IActivityParam): Promise<void> | void} addActivity
 * @property {function({playlistId: string}): Promise<any[]> | any[]} getActivitiesByPlaylistId
 */

module.exports = {};
