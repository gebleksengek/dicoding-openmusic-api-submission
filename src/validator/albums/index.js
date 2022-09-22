// @ts-check

const {
  AlbumPayloadScheme,
  UploadAlbumCoverHeaderScheme,
} = require('./scheme');

const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAlbumCoverHeader: (headers) => {
    const validationResult = UploadAlbumCoverHeaderScheme.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
