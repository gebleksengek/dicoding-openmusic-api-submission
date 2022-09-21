// @ts-check

const Joi = require('joi');

const AlbumPayloadScheme = Joi.object({
  name: Joi.string().max(50).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
});

module.exports = { AlbumPayloadScheme };
