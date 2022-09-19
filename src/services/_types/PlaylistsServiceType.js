// @ts-check

/**
 * @typedef {object} IPlaylistsService
 * @property {function({owner: string, name: string}): Promise<any> | any} addPlaylist
 * @property {function({owner: string}): Promise<any[]> | any[]} getPlaylists
 * @property {function({id: string}): Promise<any> | any}  getPlaylistById
 * @property {function({id: string}): Promise<void> | void} deletePlaylistById
 * @property {function({owner: string, id: string}): Promise<void> | void} verifyPlaylistOwner
 * @property {function({playlistId: string, userId: string}): Promise<void>  | void} verifyPlaylistAccess
 */

module.exports = {};
