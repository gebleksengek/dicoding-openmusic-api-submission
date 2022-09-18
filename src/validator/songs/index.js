// @ts-check

const InvariantError = require('../../exceptions/InvariantError');

const { SongPayloadScheme } = require('./scheme');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
