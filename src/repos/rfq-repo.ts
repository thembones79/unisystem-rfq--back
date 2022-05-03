import { BadRequestError } from "../errors";
import { pool } from "../pool";

class RfqRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
        r.id,
        rfq_code,
        eau,
        department,
        r.name AS extra_note,
        project_clients.name AS customer,
        pm.shortname AS pm,
        kam.shortname AS kam,
        to_char(r.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM rfqs AS r
        JOIN project_clients ON project_clients.id = r.project_client_id
        JOIN users AS pm ON pm.id = r.pm_id
        JOIN users AS kam ON kam.id = project_clients.kam_id
        WHERE r.id != 1
        ORDER BY updated DESC;
      `);
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findById(id: string) {
    try {
      const result = await pool.query(
        `
        SELECT
              r.id,
              rfq_code,
              eau,
              r.department AS department,
              r.clickup_id AS clickup_id,
              customer_id,
              customers.name AS customer,
              distributor_id,
              distributors.name AS distributor,
              r.pm_id AS pm_id,
              projects.id AS project_id,
              projects.project_code AS project_code,
              pm.shortname AS pm,
              pm.username AS pm_fullname,
              r.kam_id AS kam_id,
              kam.shortname AS kam,
              kam.username AS kam_fullname,
              extra_note,
              final_solutions,
              conclusions,
              samples_expected,
              mp_expected,
              eau_max,
              to_char(r.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
              FROM rfqs AS r
              JOIN customers ON customers.id = r.customer_id
              FULL OUTER JOIN projects ON projects.rfq_id = r.id
              JOIN distributors ON distributors.id = r.distributor_id
              JOIN users AS pm ON pm.id = r.pm_id
              JOIN users AS kam ON kam.id = r.kam_id
        WHERE r.id = $1
        `,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByRfqCode(rfq_code: string) {
    try {
      const result = await pool.query(
        `SELECT id, rfq_code FROM rfqs WHERE rfq_code = $1;`,
        [rfq_code]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findMaxSerialForDeptAndYear({
    department,
    year,
  }: {
    department: string;
    year: number;
  }) {
    try {
      const result = await pool.query(
        `SELECT MAX(serial) FROM rfqs WHERE department = $1 AND year = $2;`,
        [department, year + ""]
      );

      console.log({ rfq_max_count: result?.rows[0] });
      const max = result?.rows[0].max;
      return max ? parseInt(max) : 0;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    rfq_code,
    clickup_id,
    sp,
    year,
    serial,
    department,
    eau,
    project_client_id,
    name,
    pm_id,
    samples_expected,
    mp_expected,
    for_valuation,
    req_disp_tech,
    req_disp_size,
    req_disp_res,
    req_disp_brigt,
    req_disp_angle,
    req_disp_od,
    req_disp_aa,
    req_disp_inter,
    req_disp_ot,
    req_disp_st,
    req_disp_spec,
    req_tp_size,
    req_tp_aa,
    req_tp_tech,
    req_tp_od,
    req_tp_inter,
    req_tp_glass,
    req_tp_spec,
    req_others,
  }: {
    rfq_code: string;
    clickup_id: string;
    sp: string;
    year: number;
    serial: number;
    department: string;
    eau: string;
    project_client_id: string;
    name: string;
    pm_id: string;
    samples_expected: string;
    mp_expected: string;
    for_valuation: string;
    req_disp_tech: string;
    req_disp_size: string;
    req_disp_res: string;
    req_disp_brigt: string;
    req_disp_angle: string;
    req_disp_od: string;
    req_disp_aa: string;
    req_disp_inter: string;
    req_disp_ot: string;
    req_disp_st: string;
    req_disp_spec: string;
    req_tp_size: string;
    req_tp_aa: string;
    req_tp_tech: string;
    req_tp_od: string;
    req_tp_inter: string;
    req_tp_glass: string;
    req_tp_spec: string;
    req_others: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO rfqs (
          rfq_code,
          clickup_id,
          sp,
          year,
          serial,
          department,
          eau,
          project_client_id,
          name,
          pm_id,
          samples_expected,
          mp_expected,
          for_valuation,
          req_disp_tech,
          req_disp_size,
          req_disp_res,
          req_disp_brigt,
          req_disp_angle,
          req_disp_od,
          req_disp_aa,
          req_disp_inter,
          req_disp_ot,
          req_disp_st,
          req_disp_spec,
          req_tp_size,
          req_tp_aa,
          req_tp_tech,
          req_tp_od,
          req_tp_inter,
          req_tp_glass,
          req_tp_spec,
          req_others)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
          RETURNING id, rfq_code;`,
        [
          rfq_code,
          clickup_id,
          sp,
          year + "",
          serial + "",
          department,
          eau,
          project_client_id,
          name,
          pm_id,
          samples_expected,
          mp_expected,
          for_valuation,
          req_disp_tech,
          req_disp_size,
          req_disp_res,
          req_disp_brigt,
          req_disp_angle,
          req_disp_od,
          req_disp_aa,
          req_disp_inter,
          req_disp_ot,
          req_disp_st,
          req_disp_spec,
          req_tp_size,
          req_tp_aa,
          req_tp_tech,
          req_tp_od,
          req_tp_inter,
          req_tp_glass,
          req_tp_spec,
          req_others,
        ]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    eau,
    customer_id,
    distributor_id,
    pm_id,
    kam_id,
    final_solutions,
    conclusions,
    samples_expected,
    mp_expected,
    eau_max,
    extra_note,
    department,
  }: {
    id: string;
    eau: string;
    customer_id: string;
    distributor_id: string;
    pm_id: string;
    kam_id: string;
    final_solutions: string;
    conclusions: string;
    samples_expected: string;
    mp_expected: string;
    eau_max: string;
    extra_note: string;
    department: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE rfqs SET
          eau = $2,
          customer_id = $3,
          distributor_id = $4,
          pm_id = $5,
          kam_id = $6,
          final_solutions = $7,
          conclusions = $8,
          samples_expected = $9,
          mp_expected = $10,
          eau_max = $11,
          extra_note = $12,
          department = $13,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, rfq_code;`,
        [
          id,
          eau,
          customer_id,
          distributor_id,
          pm_id,
          kam_id,
          final_solutions,
          conclusions,
          samples_expected,
          mp_expected,
          eau_max,
          extra_note,
          department,
        ]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    if (id === "1") {
      throw new BadRequestError(
        `This is "SPECIAL" RFQ - you cannot delete it!`
      );
    }
    try {
      const result = await pool.query(
        `DELETE FROM rfqs WHERE id = $1 RETURNING id, rfq_code;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM rfqs;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { RfqRepo };
