/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    DROP COLUMN customer_id,
    DROP COLUMN distributor_id,
    DROP COLUMN kam_id,
    DROP COLUMN conclusions,
    DROP COLUMN eau_max,
    DROP COLUMN extra_note,
    ADD COLUMN project_client_id INTEGER NOT NULL REFERENCES project_clients(id),
    ADD COLUMN serial INTEGER NOT NULL,





    ADD COLUMN shortname VARCHAR(8) UNIQUE NOT NULL,
    ADD COLUMN shortname_alt VARCHAR(8) UNIQUE,
    ADD COLUMN deleted BOOLEAN DEFAULT FALSE,
    ADD COLUMN role_id INTEGER NOT NULL REFERENCES roles(id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE rfqs
    DROP COLUMN shortname,
    DROP COLUMN shortname_alt,
    DROP COLUMN deleted,
    DROP COLUMN role_id;
  `);
};
