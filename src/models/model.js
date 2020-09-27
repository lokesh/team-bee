import { pool } from './pool';

class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }

  async insertWithReturn(columns, values) {
    const query = `
          INSERT INTO ${this.table}(${columns})
          VALUES (${values})
          RETURNING id, ${columns}
      `;
    return this.pool.query(query);
  }

  async create(columns, values) {
    const query = `
          INSERT INTO ${this.table}(${columns})
          VALUES (${values})
          RETURNING id, ${columns}
      `;
    return this.pool.query(query);
  }

  async update(columns, values, clause) {
    let setQuery = ''
    columns.forEach((col, index) => {
      setQuery = setQuery + `"${col}" = $${index + 1} `;
    })

    let query = `
          UPDATE ${this.table}
          SET ${setQuery}
      `;
    if (clause) query += clause;
    return this.pool.query(query, values);
  }

  async select(columns, clause) {
    let query = `SELECT ${columns} FROM ${this.table} `;
    if (clause) query += clause;
    return this.pool.query(query);
  }
}

export default Model;
