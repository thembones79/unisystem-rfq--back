/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    number VARCHAR(80) UNIQUE NOT NULL,
    serial INTEGER,
    year_month_kam VARCHAR(40),
    project_client_id INTEGER NOT NULL REFERENCES project_clients(id),
    rfq_id INTEGER NOT NULL REFERENCES rfqs(id) DEFAULT 1,
    department VARCHAR(8) NOT NULL,
    ranges_margins TEXT,
    for_buffer BOOLEAN DEFAULT FALSE,
    pick_from_buffer VARCHAR(100),
    footer_pl TEXT,
    footer_en TEXT,
    buffer_pl TEXT,
    buffer_en TEXT,
    contents TEXT
  );

  CREATE UNIQUE INDEX ON offers (id);
  CREATE UNIQUE INDEX ON offers (number);

  CREATE TABLE configs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(280) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    category VARCHAR(180),
    template TEXT
  );

  CREATE UNIQUE INDEX ON configs (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE offers;
  DROP TABLE configs;
  `);
};
