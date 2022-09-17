// @ts-check
/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder}  MigrationBuilder
 */

const table_name = 'albums';

/**
 * @param {MigrationBuilder} pgm migration builder type interface
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(22)',
      primaryKey: true,
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
    },
    year: {
      type: 'smallint',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
    },
  });
};

/**
 * @param {MigrationBuilder} pgm migration builder type interface
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
