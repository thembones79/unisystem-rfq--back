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
      COALESCE(extra_note, '') AS extra_note,
        customers.name AS customer,
        distributors.name AS distributor,
        pm.shortname AS pm,
        kam.shortname AS kam,
        to_char(r.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM rfqs AS r
        JOIN customers ON customers.id = r.customer_id
        JOIN distributors ON distributors.id = r.distributor_id
        JOIN users AS pm ON pm.id = r.pm_id
        JOIN users AS kam ON kam.id = r.kam_id
        ORDER BY updated DESC;
      `);
      return result?.rows;
    } catch (error) {
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
              clickup_id,
              customer_id,
              customers.name AS customer,
              distributor_id,
              distributors.name AS distributor,
              pm_id,
              pm.shortname AS pm,
              pm.username AS pm_fullname,
              kam_id,
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
              JOIN distributors ON distributors.id = r.distributor_id
              JOIN users AS pm ON pm.id = r.pm_id
              JOIN users AS kam ON kam.id = r.kam_id
        WHERE r.id = $1
        `,
        [id]
      );
      return result?.rows[0];
    } catch (error) {
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
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByDistributorId(distributor_id: string) {
    try {
      const result = await pool.query(
        `SELECT id, rfq_code FROM rfqs WHERE distributor_id = $1;`,
        [distributor_id]
      );
      return result?.rows;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    rfq_code,
    eau,
    customer_id,
    distributor_id,
    pm_id,
    kam_id,
    clickup_id,
    final_solutions,
    conclusions,
    samples_expected,
    mp_expected,
    eau_max,
    extra_note,
  }: {
    rfq_code: string;
    eau: string;
    customer_id: string;
    distributor_id: string;
    pm_id: string;
    kam_id: string;
    clickup_id: string;
    final_solutions: string;
    conclusions: string;
    samples_expected: string;
    mp_expected: string;
    eau_max: string;
    extra_note: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO rfqs (
          rfq_code,
          eau,
          customer_id,
          distributor_id,
          pm_id,
          kam_id,
          clickup_id,
          final_solutions,
          conclusions,
          samples_expected,
          mp_expected,
          eau_max,
          extra_note)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id, rfq_code;`,
        [
          rfq_code,
          eau,
          customer_id,
          distributor_id,
          pm_id,
          kam_id,
          clickup_id,
          final_solutions,
          conclusions,
          samples_expected,
          mp_expected,
          eau_max,
          extra_note,
        ]
      );
      return result?.rows[0];
    } catch (error) {
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
        ]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM rfqs WHERE id = $1 RETURNING id, rfq_code;`,
        [id]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM rfqs;`);
      return parseInt(result?.rows[0].count);
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }
}

export { RfqRepo };
