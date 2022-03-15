/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE requirements (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rfq_id INTEGER NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    c_nc_cwr VARCHAR(4),
    requirement TEXT,
    note TEXT
  );

  CREATE UNIQUE INDEX ON requirements (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE requirements;
  `);
};
