// @ts-check

const {
  PostAddPlaylistSongPayloadScheme,
  PostCreatePlaylistPayloadScheme,
} = require('./scheme');

const InvariantError = require('../../exceptions/InvariantError');

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
