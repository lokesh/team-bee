import Model from '../models/model.js';

const model = new Model('users');

// GET /users
export const listUsers = async (req, res) => {
  try {
    const data = await model.select('*');
    // Ensure we're sending valid JSON by checking the data
    if (!Array.isArray(data.rows)) {
      throw new Error('Database response is not in expected format');
    }
    // Sanitize the data to ensure it's valid JSON
    const sanitizedData = data.rows.map(row => ({
      id: Number(row.id),
      name: String(row.name),
      color: String(row.color)
    }));
    res.status(200).json(sanitizedData);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /users/:id
export const showUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const data = await model.select('*', `WHERE id = ${id}`);
    if (data.rows.length) {
      res.status(200).json(data.rows[0]);
    } else {
      res.statusMessage = `User with id of ${id} not found`;
      res.status(404).end();
    }
  } catch (err) {
    res.status(200).json({ rows: err.stack });
  }
};
