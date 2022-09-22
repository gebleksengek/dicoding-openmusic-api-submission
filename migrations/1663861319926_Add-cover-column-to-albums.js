/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'text',
      default: null,
    },
  });
};

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover');
};
