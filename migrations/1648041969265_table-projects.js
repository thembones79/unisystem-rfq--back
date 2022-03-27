/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    project_code VARCHAR(80) UNIQUE NOT NULL,
    project_client_id INTEGER NOT NULL REFERENCES project_clients(id),
    industry_id INTEGER NOT NULL REFERENCES industries(id),
    rfq_id INTEGER NOT NULL REFERENCES rfqs(id),
    department VARCHAR(8),
    pm_id INTEGER NOT NULL REFERENCES users(id),
    clickup_id VARCHAR(18),
    version VARCHAR(18),
    revision VARCHAR(18),
    note TEXT
  );

  CREATE UNIQUE INDEX ON projects (id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE projects;
  `);
};
