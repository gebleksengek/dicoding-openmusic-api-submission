/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

const table_name = 'playlist_song_activities';

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(20)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(25)',
      notNull: true,
      references: 'playlists(id)',
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'varchar(21)',
      notNull: true,
    },
    user_id: {
      type: 'varchar(21)',
      notNull: true,
    },
    action: {
      type: 'text',
      notNull: true,
    },
    time: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
