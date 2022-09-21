// @ts-check

const Joi = require('joi');

const ExportPlaylistPayloadScheme = Joi.object({
  targetEmail: Joi.string().email().required(),
});

module.exports = {
  ExportPlaylistPayloadScheme,
};
