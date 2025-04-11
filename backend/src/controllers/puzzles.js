import debug from 'debug';
import Model from '../models/model.js';
import { pool } from '../models/pool.js';

const model = new Model('puzzles');

// Test database connection
export const testConnection = async (req, res) => {
  console.log('Test connection request received:', {
    headers: req.headers,
    method: req.method,
    url: req.url,
    query: req.query
  });

  try {
    console.log('Attempting database connection...');
    console.log('Connection pool options:', pool.options);
    
    const result = await pool.query('SELECT NOW()');
    console.log('Database query successful:', {
      timestamp: result.rows[0].now,
      rowCount: result.rowCount
    });

    res.status(200).json({ 
      success: true, 
      timestamp: result.rows[0].now,
      connectionInfo: pool.options
    });
  } catch (err) {
    console.error('Database connection error:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });

    res.status(400).json({ 
      success: false, 
      error: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });
  }
};

// GET /puzzles
export const listPuzzles = async (req, res) => {
  const {order_by, dir, hide_future} = req.query;
  let sort = (order_by && dir) ? `ORDER BY ${order_by} ${dir}` : '';
  let clause = (hide_future) ? 'WHERE "date" <= CURRENT_DATE' : '';

  try {
    const data = await model.select('*', clause, sort);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(400).json({ data: err.stack });
  }
};

// POST /puzzles
export const createPuzzle = async (req, res) => {
  const columns = ['date', 'center_letter', 'outer_letters', 'answers' ].join(',');
  const {
    date, center_letter, outer_letters, answers
  } = req.body;

  const values = `'${date}', '${center_letter}', '{${outer_letters}}', '{${answers}}'`;
  try {
    const data = await model.create(columns, values);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(400).json({ data: err.stack });
  }
};

// GET /puzzles/:id
export const showPuzzle = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const data = await model.select('*', `WHERE id = ${id}`);
    if (data.rows.length) {
      res.status(200).json(data.rows[0]);
    } else {
      res.statusMessage = `Puzzle with id of ${id} not found`;
      res.status(404).end();
    }
  } catch (err) {
    res.status(400).json({ data: err.stack });
  }
};

// DELETE /puzzles/:id
export const deletePuzzle = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const data = await model.delete(`WHERE "id" = '${id}'`);
     if (data.rows.length) {
      res.status(200).json(data.rows[0]);
    } else {
      res.statusMessage = `Puzzle with id of ${id} was not deleted. Does it exist?`;
      res.status(404).end();
    }
  } catch (err) {
    res.status(400).json({ data: err.stack });
  }
};
