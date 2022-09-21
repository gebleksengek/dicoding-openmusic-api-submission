// @ts-check

const InvariantError = require('../../exceptions/InvariantError');

const { ExportPlaylistPayloadScheme } = require('./scheme');

const ExportsValidator = {
  ValidateExportPlaylist: (payload) => {
    const validationResult = ExportPlaylistPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
