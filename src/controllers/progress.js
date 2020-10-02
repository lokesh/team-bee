import debug from 'debug';
import Model from '../models/model';

const model = new Model('user_puzzles');

// GET /puzzles/:id/users
export const listUsersProgress = async (req, res) => {
  const puzzle_id = parseInt(req.params.puzzle_id);
  try {
    const data = await model.select('*', `WHERE "puzzle_id" = ${puzzle_id}`);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(200).json({ rows: err.stack });
  }
};

// GET /puzzles/:puzzle_id/users/:user_id
export const showUserProgress = async (req, res) => {
  const puzzle_id = parseInt(req.params.puzzle_id);
  const user_id = parseInt(req.params.user_id);
  try {
    const data = await model.select('*', `WHERE "puzzle_id" = ${puzzle_id} AND "user_id" = ${user_id}`);
    if (data.rows.length) {
      res.status(200).json(data.rows[0]);
    } else {
      res.statusMessage = `No progress data found for user ${user_id} and puzzle ${puzzle_id}`;
      res.status(200).end();
    }
  } catch (err) {
    res.status(200).json({ rows: err.stack });
  }
};

// POST /puzzles/:puzzle_id/users/:user_id
export const createUserProgress = async (req, res) => {
  const puzzle_id = parseInt(req.params.puzzle_id);
  const user_id = parseInt(req.params.user_id);

  const columns = [ 'puzzle_id', 'user_id' ].join(',');
  const values = `${puzzle_id}, ${user_id}`;

  try {
    const data = await model.create(columns, values);
    res.status(200).json(data.rows[0]);
  } catch (err) {
    res.status(400).json({ data: err.stack });
  }
};

// PUT /puzzles/:id/users/:user_id
export const updateUserProgress = async (req, res) => {
  const puzzle_id = parseInt(req.params.puzzle_id);
  const user_id = parseInt(req.params.user_id);

  const TABLE_COLUMNS = [ 'found_words', 'team_mode', 'hint', 'revealed' ];

  const columns = []; // Columns we want to update
  const values = [];

  TABLE_COLUMNS.forEach(col => {
    if (req.body.hasOwnProperty(col)) {
      columns.push(col);
      values.push(req.body[col]);
    }
  });

  if (columns.length === 0) {
    throw new Error('No valid columns in the user_puzzles table specified for updating.');
  }

  try {
    const data = await model.update(columns, values, `WHERE "puzzle_id" = ${puzzle_id} AND "user_id" = ${user_id}`);
    if (data.rows.length) {
      res.status(200).json(data.rows[0]);
    } else {
      res.statusMessage = `Error updating progress data for user ${user_id} and puzzle ${puzzle_id}`;
      res.status(200).end();
    }
  } catch (err) {
    res.status(200).json({ rows: err.stack });
  }
};
