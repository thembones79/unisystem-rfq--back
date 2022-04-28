/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE rndtasks (
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    serial INTEGER NOT NULL,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    PRIMARY KEY (project_id, serial)
  );

  CREATE UNIQUE INDEX ON rndtasks (project_id, serial);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE rndtasks;
  `);
};
