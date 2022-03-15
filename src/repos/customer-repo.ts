import { BadRequestError } from "../errors";
import { pool } from "../pool";

class CustomerRepo {
  static async find() {
    try {
      const result = await pool.query(
        `
        SELECT id, name
        FROM customers
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
        `SELECT id, name FROM customers WHERE id = $1;`,
        [id]
      );
      return result?.rows[0];
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }

  static async count() {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM customers;`);
      return parseInt(result?.rows[0].count);
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }
}

export { CustomerRepo };
