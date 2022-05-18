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
        for_valuation::VARCHAR,
        r.name AS extra_note,
        project_clients.name AS customer,
        kam.id AS kam_id,
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

  static async findByKamId(kamId: string) {
    try {
      const result = await pool.query(
        `
      SELECT
        r.id,
        rfq_code,
        eau,
        department,
        for_valuation::VARCHAR,
        r.name AS extra_note,
        r.project_client_id AS project_client_id,
        project_clients.name AS customer,
        kam.id AS kam_id,
        pm.shortname AS pm,
        kam.shortname AS kam,
        to_char(r.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM rfqs AS r
        JOIN project_clients ON project_clients.id = r.project_client_id
        JOIN users AS pm ON pm.id = r.pm_id
        JOIN users AS kam ON kam.id = project_clients.kam_id
        WHERE r.id != 1 AND kam.id = $1
        ORDER BY updated DESC;
      `,
        [kamId]
      );
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
              r.name AS name,
              sp,
              year,
              serial,
              project_clients.name AS customer,
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
              r.pm_id AS pm_id,
              projects.id AS project_id,
              projects.project_code AS project_code,
              pm.shortname AS pm,
              pm.username AS pm_fullname,
              project_clients.kam_id AS kam_id,
              kam.shortname AS kam,
              kam.username AS kam_fullname,
              final_solutions,
              samples_expected,
              mp_expected,
              to_char(r.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
              FROM rfqs AS r
              FULL OUTER JOIN projects ON projects.rfq_id = r.id
              JOIN project_clients ON project_clients.id = r.project_client_id
              JOIN users AS pm ON pm.id = r.pm_id
              JOIN users AS kam ON kam.id = project_clients.kam_id
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
    pm_id,
    name,
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
    final_solutions,
  }: {
    id: string;
    eau: string;
    pm_id: string;
    name: string;
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
    final_solutions: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE rfqs SET
          eau = $2,
          pm_id = $3,
          name = $4,
          samples_expected = $5,
          mp_expected = $6,
          for_valuation = $7,
          req_disp_tech = $8,
          req_disp_size = $9,
          req_disp_res = $10,
          req_disp_brigt = $11,
          req_disp_angle = $12,
          req_disp_od = $13,
          req_disp_aa = $14,
          req_disp_inter = $15,
          req_disp_ot = $16,
          req_disp_st = $17,
          req_disp_spec = $18,
          req_tp_size = $19,
          req_tp_aa = $20,
          req_tp_tech = $21,
          req_tp_od = $22,
          req_tp_inter = $23,
          req_tp_glass = $24,
          req_tp_spec = $25,
          req_others = $26,
          final_solutions = $27,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, rfq_code;`,
        [
          id,
          eau,
          pm_id,
          name,
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
          final_solutions,
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
