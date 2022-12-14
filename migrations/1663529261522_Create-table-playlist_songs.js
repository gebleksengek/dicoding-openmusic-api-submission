/* eslint-disable camelcase */

/**
 * @typedef {import('node-pg-migrate').MigrationBuilder} MigrationBuilder
 */

const table_name = 'playlist_songs';

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(table_name, {
    id: {
      type: 'varchar(30)',
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
      references: 'songs(id)',
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

  pgm.addConstraint(
    table_name,
    `unique_${table_name}_playlist_id_and_song_id`,
    'UNIQUE(playlist_id, song_id)'
  );
};

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable(table_name);
};
