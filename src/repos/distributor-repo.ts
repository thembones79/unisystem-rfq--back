import { BadRequestError } from "../errors";
import { pool } from "../pool";

class DistributorRepo {
  static async find() {
    try {
      const result = await pool.query(
        `
        SELECT id, name
        FROM distributors
        ORDER BY name;
        `
      );
      return result?.rows;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async findById(id: string) {
    try {
      const result = await pool.query(
        `SELECT id, name FROM distributors WHERE id = $1;`,
        [id]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async findByName(name: string) {
    try {
      const result = await pool.query(
        `SELECT id, name FROM distributors WHERE name = $1;`,
        [name]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async insert({ name }: { name: string }) {
    try {
      const result = await pool.query(
        `INSERT INTO distributors (name) VALUES ($1) RETURNING id, name;`,
        [name]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async updateData({ id, name }: { id: string; name: string }) {
    try {
      const result = await pool.query(
        `UPDATE distributors SET name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name;`,
        [id, name]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async delete(id: string) {
    try {
      const result = await pool.query(
        `DELETE FROM distributors WHERE id = $1 RETURNING id, name;`,
        [id]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM distributors;`);
      return parseInt(result?.rows[0].count);
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }
}

export { DistributorRepo };
