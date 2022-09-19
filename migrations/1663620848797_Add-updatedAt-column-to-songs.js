/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.addColumn('songs', {
    deletedAt: {
      type: 'timestamp',
      default: null,
    },
  });
};

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropColumn('songs', 'deletedAt');
};
