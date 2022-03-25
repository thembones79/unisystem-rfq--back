/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE project_clients
    ADD COLUMN kam_id INTEGER NOT NULL REFERENCES users(id),
    ADD COLUMN client_list_clickup_id VARCHAR(18);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE project_clients
    DROP COLUMN kam_id,
    DROP COLUMN client_list_clickup_id;
  `);
};
