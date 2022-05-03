/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    DROP INDEX rfqs_project_client_id_idx;
    CREATE INDEX ON rfqs (project_client_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP INDEX rfqs_project_client_id_idx;
  CREATE UNIQUE INDEX ON rfqs (project_client_id);
  `);
};
