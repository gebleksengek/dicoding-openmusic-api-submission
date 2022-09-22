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

const UploadAlbumCoverHeaderScheme = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp'
    )
    .required(),
}).unknown();

module.exports = { AlbumPayloadScheme, UploadAlbumCoverHeaderScheme };
