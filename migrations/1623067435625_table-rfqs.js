/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE rfqs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rfq_code VARCHAR(80) UNIQUE NOT NULL,
    eau INTEGER,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    distributor_id INTEGER NOT NULL REFERENCES distributors(id),
    kam_id INTEGER NOT NULL REFERENCES users(id),
    pm_id INTEGER NOT NULL REFERENCES users(id)
  );

  CREATE UNIQUE INDEX ON rfqs (rfq_code);

  CREATE UNIQUE INDEX ON rfqs (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE rfqs;
  `);
};
