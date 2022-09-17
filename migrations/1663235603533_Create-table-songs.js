/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

const table_name = 'songs';

/**
 * @param {MigrationBuilder} pgm migration builder type interface
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(21)',
      primaryKey: true,
    },
    title: {
      type: 'varchar(50)',
      notNull: true,
    },
    year: {
      type: 'smallint',
      notNull: true,
    },
    performer: {
      type: 'varchar(50)',
      notNull: true,
    },
    genre: {
      type: 'varchar(32)',
      notNull: true,
    },
    duration: {
      type: 'smallint',
    },
    albumId: {
      type: 'varchar(22)',
      references: '"albums"',
      onUpdate: 'cascade',
      onDelete: 'cascade',
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
 * @param {MigrationBuilder} pgm migration builder interface type
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
