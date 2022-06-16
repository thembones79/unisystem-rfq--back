import { BadRequestError } from "../errors";
import { pool } from "../pool";

class OfferRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
        o.id,
        number,
        department,
        project_clients.name AS client,
        kam.shortname AS kam,
        kam.id AS kam_id,
        to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM offers AS o
        JOIN project_clients ON project_clients.id = o.project_client_id
        JOIN users AS kam ON kam.id = project_clients.kam_id
        ORDER BY number DESC;
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
        o.id,
        number,
        department,
        project_clients.name AS client,
        kam.shortname AS kam,
        kam.id AS kam_id,
        to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
        FROM offers AS o
        JOIN project_clients ON project_clients.id = o.project_client_id
        JOIN users AS kam ON kam.id = project_clients.kam_id
        WHERE kam.id = $1
        ORDER BY number DESC;
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
          o.id,
          number,
          o.department AS department,
          project_clients.name AS client,
          kam.shortname AS kam,
          kam.shortname_alt AS kam_folder,
          kam.username AS kam_fullname,
          o.project_client_id AS project_client_id,
          rfq_id,
          rfqs.rfq_code AS rfq,
          ranges_margins,
          for_buffer,
          pick_from_buffer,
          footer_pl,
          footer_en,
          buffer_pl,
          buffer_en,
          contents,
          to_char(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated
          FROM offers AS o
          JOIN project_clients ON project_clients.id = o.project_client_id
          JOIN industries ON industries.id = o.industry_id
          JOIN rfqs ON rfqs.id = o.rfq_id
          JOIN users AS pm ON pm.id = o.pm_id
          JOIN users AS kam ON kam.id = project_clients.kam_id
        WHERE o.id = $1
        `,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByOfferNumber(offer_number: string) {
    try {
      const result = await pool.query(
        `SELECT id, number FROM offers WHERE number = $1;`,
        [offer_number]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findMaxSerialForYearMonthKam(year_month_kam: string) {
    try {
      const result = await pool.query(
        `SELECT MAX(serial) FROM offers WHERE year_month_kam = $1;`,
        [year_month_kam]
      );

      console.log({ offer_max_count: result?.rows[0] });
      const max = result?.rows[0].max;
      return max ? parseInt(max) : 0;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    number,
    serial,
    year_month_kam,
    project_client_id,
    rfq_id,
    department,
    ranges_margins,
    for_buffer,
    pick_from_buffer,
    footer_pl,
    footer_en,
    buffer_pl,
    buffer_en,
    contents,
  }: {
    number: string;
    serial: string;
    year_month_kam: string;
    project_client_id: string;
    rfq_id: string;
    department: string;
    ranges_margins: string;
    for_buffer: string;
    pick_from_buffer: string;
    footer_pl: string;
    footer_en: string;
    buffer_pl: string;
    buffer_en: string;
    contents: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO projects (
          project_code,
          project_client_id,
          industry_id,
          rfq_id,
          department,
          pm_id,
          clickup_id,
          version,
          revision,
          note)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id, project_code;`,
        [
          project_code,
          project_client_id,
          industry_id,
          rfq_id,
          department,
          pm_id,
          clickup_id,
          version,
          revision,
          note,
        ]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    pm_id,
    version,
    revision,
    note,
  }: {
    id: string;
    pm_id: string;
    version: string;
    revision: string;
    note: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE projects SET
          pm_id = $2,
          version = $3,
          revision = $4,
          note = $5,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, project_code;`,
        [id, pm_id, version, revision, note]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM projects WHERE id = $1 RETURNING id, project_code;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM projects;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { OfferRepo };
