// @ts-check

const Joi = require('joi');

const PostCreatePlaylistPayloadScheme = Joi.object({
  name: Joi.string().max(50).required(),
});

const PostAddPlaylistSongPayloadScheme = Joi.object({
  songId: Joi.string().max(21).required(),
});

module.exports = {
  PostCreatePlaylistPayloadScheme,
  PostAddPlaylistSongPayloadScheme,
};
