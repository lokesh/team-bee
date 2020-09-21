import debug from 'debug';
import Model from '../models/model';
const model = new Model('user_puzzles');

// GET /users/:id/puzzles/:puzzleId
export const showUserProgress = async (req, res) => {
  const id = parseInt(req.params.id);
  const puzzleId = parseInt(req.params.puzzleId);
  try {
    const data = await model.select('*', `WHERE "userId" = ${id} AND "puzzleId" = ${puzzleId}`);
   if (data.rows.length) {
      res.status(200).json(data.rows[0]);  
    } else {
      res.statusMessage = `No progress data found for user ${id} and puzzle ${puzzleId}`;
      res.status(404).end();  
    }
  } catch (err) {
    res.status(200).json({ rows: err.stack });
   }
}

// PUT /users/:id/puzzles/:puzzleId
export const updateUserProgress = async (req, res) => {
  const id = parseInt(req.params.id);
  const puzzleId = parseInt(req.params.puzzleId);
  
  // const columns = ['name', 'config'].join(',');
  // const { name, config } = req.body;
  // const values = `'${name}', '${config}'`;
  // try {    
  //   const data = await model.create(columns, values);
  //   res.status(200).json({ data: data.rows});
  // } catch (err) {
  //   res.status(400).json({ data:err.stack });
  // }
}
