import { BadRequestError } from "../errors";
import { pool } from "../pool";

const TEMP = `

CREATE TABLE project_clients (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(80) UNIQUE NOT NULL,
  code VARCHAR(80) UNIQUE NOT NULL
);
`;

class ProjectClientRepo {
  static async find() {
    try {
      const result = await pool.query(`
      SELECT id, name, code
      FROM project_clients
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
        `SELECT id, name, code FROM project_clients WHERE id = $1;`,
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
        `SELECT id, name, code FROM project_clients WHERE name = $1;`,
        [name]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({ name, code }: { name: string; code: string }) {
    try {
      const result = await pool.query(
        `INSERT INTO project_clients (
          name,
          code)
          VALUES ($1, $2)
          RETURNING id, name, code;`,
        [name, code]
      );
      return result?.rows[0];
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({
    id,
    name,
    code,
  }: {
    id: string;
    name: string;
    code: string;
  }) {
    try {
      const result = await pool.query(
        `UPDATE project_clients SET
          name = $2,
          code = $3,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, rfq_code;`,
        [id, name, code]
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
