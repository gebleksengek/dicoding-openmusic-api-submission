// @ts-check

const Joi = require('joi');

const AlbumPayloadScheme = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { AlbumPayloadScheme };
