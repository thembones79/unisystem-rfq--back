/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE partnumbers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pn VARCHAR(80) UNIQUE NOT NULL,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    version VARCHAR(18),
    revision VARCHAR(18),
    note TEXT
  );

  CREATE UNIQUE INDEX ON partnumbers (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE partnumbers;
  `);
};
