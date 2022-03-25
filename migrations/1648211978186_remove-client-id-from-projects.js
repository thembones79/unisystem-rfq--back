/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE projects
    DROP COLUMN project_client_id;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE projects
    ADD COLUMN project_client_id INTEGER NOT NULL REFERENCES project_clients(id);
  `);
};
