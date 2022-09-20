// @ts-check

const autoBind = require('auto-bind');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('../../services/_types/PlaylistsServiceType').IPlaylistsService} IPlaylistsService
 * @typedef {import('../../services/_types/PlaylistSongsServiceType').IPlaylistSongsService} IPlaylistSongsService
 */

class PlaylistsHandler {
  /**
   * @readonly
   * @private
   */
  _playlistsService;

  /**
   * @readonly
   * @private
   */
  _playlistSongsService;

  /**
   * @readonly
   * @private
   */
  _validator;

  /**
   * @param {IPlaylistsService} playlistsService
   * @param {IPlaylistSongsService} playlistSongsService
   * @param {import('../../validator/playlists')} validator
   */
  constructor(playlistsService, playlistSongsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    autoBind(this);
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postPlaylistHandler(request, h) {
    this._validator.validateCreatePlaylist(request.payload);

    const { name } = /** @type {{name: string}} */ (request.payload);
    const { userId: owner } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    const playlistId = await this._playlistsService.addPlaylist({
      owner,
      name,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   */
  async getPlaylistsHandler(request) {
    const { userId: owner } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    const playlists = await this._playlistsService.getPlaylists({ owner });

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  /**
   * @param {Request} request
   */
  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = /** @type {{id: string}} */ (request.params);
    const { userId } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    await this._playlistsService.verifyPlaylistAccess({ userId, playlistId });
    await this._playlistsService.deletePlaylistById({ id: playlistId });

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  /**
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  async postPlaylistSongHandler(request, h) {
    this._validator.validateAddPlaylistSong(request.payload);

    const { id: playlistId } = /** @type {{id: string}} */ (request.params);
    const { songId } = /** @type {{songId: string}} */ (request.payload);
    const { userId } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    await this._playlistsService.verifyPlaylistAccess({ userId, playlistId });
    await this._playlistSongsService.addPlaylistSong({
      playlistId,
      songId,
    });

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke playlist',
    });
    response.code(201);

    return response;
  }

  /**
   * @param {Request} request
   */
  async getPlaylistByIdHandler(request) {
    const { id } = /** @type {{id: string}} */ (request.params);
    const { userId } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );

    await this._playlistsService.verifyPlaylistAccess({
      userId,
      playlistId: id,
    });
    const playlist = await this._playlistsService.getPlaylistById({ id });

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  /**
   * @param {Request} request
   */
  async deletePlaylistSongByIdHandler(request) {
    this._validator.validateAddPlaylistSong(request.payload);

    const { id: playlistId } = /** @type {{id: string}} */ (request.params);
    const { userId } = /** @type {{userId: string}} */ (
      request.auth.credentials
    );
    const { songId } = /** @type {{songId: string}} */ (request.payload);

    await this._playlistsService.verifyPlaylistAccess({ userId, playlistId });
    await this._playlistSongsService.deletePlaylistSongById({
      playlistId,
      songId,
    });

    return {
      status: 'success',
      message: 'Song berhasil dihapus dari palylist',
    };
  }
}

module.exports = PlaylistsHandler;
