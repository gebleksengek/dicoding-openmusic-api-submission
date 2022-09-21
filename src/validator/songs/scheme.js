// @ts-check

const Joi = require('joi');

const SongPayloadScheme = Joi.object({
  title: Joi.string().max(50).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  genre: Joi.string().max(32).required(),
  performer: Joi.string().max(50).required(),
  duration: Joi.number(),
  albumId: Joi.string().max(22),
});

module.exports = { SongPayloadScheme };
