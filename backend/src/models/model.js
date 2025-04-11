import { pool } from './pool.js';

class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }

  async create(columns, values) {
    const query = `
          INSERT INTO ${this.table}(${columns})
          VALUES (${values})
          RETURNING *
      `;
    return this.pool.query(query);
  }

  // DELETE FROM "puzzles" WHERE "id" = '22'
  async delete(clause) {
    if (!clause) {
      throw new Error('DELETE method requires a clause, e.g. "WHERE id = 2"');
    }

    const query = `
          DELETE FROM ${this.table} 
          ${clause}
          RETURNING *
      `;
    return this.pool.query(query);
  }


  async update(columns, values, clause) {
    let setQuery = '';
    columns.forEach((col, index) => {
      setQuery += `"${col}" = $${index + 1} `;
    });

    let query = `
          UPDATE ${this.table}
          SET ${setQuery}
      `;
    if (clause) query += clause;
    return this.pool.query(query, values);
  }

  async select(columns, clause, sort) {
    let query = `SELECT ${columns} FROM ${this.table}`;
    if (clause) query += ' ' + clause;
    if (sort) query += ' ' + sort;
    return this.pool.query(query);
  }
}

export default Model;
