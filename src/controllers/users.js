import Model from '../models/model';

const model = new Model('users');

// GET /users
export const listUsers = async (req, res) => {
  try {
    const data = await model.select('*');
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(200).json(err.stack);
   }
}

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
}
