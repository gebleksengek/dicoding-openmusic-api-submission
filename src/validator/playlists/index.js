// @ts-check

const InvariantError = require('../../exceptions/InvariantError');

const {
  PostCreatePlaylistPayloadScheme,
  PostAddPlaylistSongPayloadScheme,
} = require('./scheme');

const PlaylistsValidator = {
  validateCreatePlaylist: (payload) => {
    const validationResult = PostCreatePlaylistPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAddPlaylistSong: (payload) => {
    const validationResult = PostAddPlaylistSongPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
