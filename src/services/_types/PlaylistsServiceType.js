// @ts-check

/**
 * @typedef {object} IPlaylistsService
 * @property {function({owner: string, name: string}): Promise<any> | any} addPlaylist
 * @property {function({owner: string}): Promise<any[]> | any[]} getPlaylists
 * @property {function({owner: string, id: string}): Promise<void> | void} deletePlaylist
 * @property {function({owner: string, playlistId: string, songId: string}): Promise<void> | void} addPlaylistSong
 * @property {function({owner: string, id: string}): Promise<any[]> | any[]} getPlaylistSongs
 * @property {function({owner: string, playlistId: string, songId: string}): Promise<void> | void} deletePlaylistSong
 * @property {function({owner: string, playlistId: string}): Promise<void> | void} verifyPlaylistOwner
 */

module.exports = {};
