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
    ADD COLUMN project_client_id INTEGER REFERENCES project_clients(id),
    ADD COLUMN serial INTEGER,
    ADD COLUMN year INTEGER,
    ADD COLUMN name VARCHAR(250),
    ADD COLUMN for_valuation BOOLEAN DEFAULT FALSE,
    ADD COLUMN req_disp_tech VARCHAR(80),
    ADD COLUMN req_disp_size VARCHAR(80),
    ADD COLUMN req_disp_res VARCHAR(80),
    ADD COLUMN req_disp_brigt VARCHAR(80),
    ADD COLUMN req_disp_angle VARCHAR(80),
    ADD COLUMN req_disp_od VARCHAR(80),
    ADD COLUMN req_disp_aa VARCHAR(80),
    ADD COLUMN req_disp_inter VARCHAR(80),
    ADD COLUMN req_disp_ot VARCHAR(80),
    ADD COLUMN req_disp_st VARCHAR(80),
    ADD COLUMN req_disp_spec VARCHAR(80),
    ADD COLUMN req_tp_size VARCHAR(80),
    ADD COLUMN req_tp_aa VARCHAR(80),
    ADD COLUMN req_tp_tech VARCHAR(80),
    ADD COLUMN req_tp_od VARCHAR(80),
    ADD COLUMN req_tp_inter VARCHAR(80),
    ADD COLUMN req_tp_glass VARCHAR(80),
    ADD COLUMN req_tp_spec VARCHAR(80),
    ADD COLUMN req_others TEXT;

    CREATE UNIQUE INDEX ON rfqs (serial, year, department);
    CREATE UNIQUE INDEX ON rfqs (project_client_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP INDEX rfqs_serial_year_department_idx;

    ALTER TABLE rfqs
    DROP COLUMN project_client_id,
    DROP COLUMN serial,
    DROP COLUMN year,
    DROP COLUMN name,
    DROP COLUMN for_valuation,
    DROP COLUMN req_disp_tech,
    DROP COLUMN req_disp_size,
    DROP COLUMN req_disp_res,
    DROP COLUMN req_disp_brigt,
    DROP COLUMN req_disp_angle,
    DROP COLUMN req_disp_od,
    DROP COLUMN req_disp_aa,
    DROP COLUMN req_disp_inter,
    DROP COLUMN req_disp_ot,
    DROP COLUMN req_disp_st,
    DROP COLUMN req_disp_spec,
    DROP COLUMN req_tp_size,
    DROP COLUMN req_tp_aa,
    DROP COLUMN req_tp_tech,
    DROP COLUMN req_tp_od,
    DROP COLUMN req_tp_inter,
    DROP COLUMN req_tp_glass,
    DROP COLUMN req_tp_spec,
    DROP COLUMN req_others,
    ADD COLUMN customer_id INTEGER NOT NULL REFERENCES customers(id),
    ADD COLUMN distributor_id INTEGER NOT NULL REFERENCES distributors(id),
    ADD COLUMN kam_id INTEGER NOT NULL REFERENCES users(id),
    ADD COLUMN conclusions TEXT,
    ADD COLUMN eau_max INTEGER,
    ADD COLUMN extra_note VARCHAR(240);
  `);
};
