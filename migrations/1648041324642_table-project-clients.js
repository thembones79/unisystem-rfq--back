/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE project_clients (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(80) UNIQUE NOT NULL,
    code VARCHAR(80) UNIQUE NOT NULL
  );

  CREATE UNIQUE INDEX ON project_clients (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE project_clients;
  `);
};
