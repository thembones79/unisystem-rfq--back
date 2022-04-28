import { BadRequestError } from "../errors";
import { pool } from "../pool";

class ProjectClientRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT
      project_clients.id AS id,
      name,
      code,
      kam.shortname AS kam
      FROM project_clients
      JOIN users AS kam ON kam.id = project_clients.kam_id
      ORDER BY name;
      `);
      return result?.rows;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findById(id: string) {
    try {
      const result = await pool.query(
        `SELECT
        p.id AS id,
        name,
        code,
        client_list_clickup_id,
        kam_id,
        kam.shortname AS kam,
        kam.role_id AS kam_role,
        kam.shortname_alt AS kam_alt
        FROM project_clients AS p
        JOIN users AS kam ON kam.id = p.kam_id
        WHERE p.id = $1;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByCode(code: string) {
    try {
      const result = await pool.query(
        `SELECT id, name, code FROM project_clients WHERE code = $1;`,
        [code]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByName(name: string) {
    try {
      const result = await pool.query(
        `SELECT id, name, code FROM project_clients WHERE lower(name) = $1;`,
        [name.toLowerCase()]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({
    name,
    code,
    kam_id,
  }: {
    name: string;
    code: string;
    kam_id: string;
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO project_clients (
          name,
          code,
          kam_id)
          VALUES ($1, $2, $3)
          RETURNING id, name, code;`,
        [name, code, kam_id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    name,
    kam_id,
  }: {
    id: string;
    name: string;
    kam_id: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE project_clients SET
          name = $2,
          kam_id = $3,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, name, code;`,
        [id, name, kam_id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM project_clients WHERE id = $1 RETURNING id, name, code;`,
        [id]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM project_clients;`);
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async countByFirstLetter(letter: string) {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) FROM project_clients WHERE name LIKE $1;`,
        [`${letter}%`]
      );

      console.log({ count: parseInt(result?.rows[0].count) });
      return parseInt(result?.rows[0].count);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}

export { ProjectClientRepo };
