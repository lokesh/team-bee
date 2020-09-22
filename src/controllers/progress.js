import debug from 'debug';
import Model from '../models/model';
const model = new Model('user_puzzles');


// GET /puzzles/:id/users
export const listUsersProgress = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const data = await model.select('*', `WHERE "puzzleid" = ${id}`);
    res.status(200).json(data.rows);  
  } catch (err) {
    res.status(200).json({ rows: err.stack });
   }
}

// GET /puzzles/:puzzleId/users/:userId
export const showUserProgress = async (req, res) => {
  const puzzleId = parseInt(req.params.puzzleId);
  const userId = parseInt(req.params.userId);
  try {
    const data = await model.select('*', `WHERE "puzzleid" = ${puzzleId} AND "userid" = ${userId}`);
    if (data.rows.length) {
      res.status(200).json(data.rows[0]);  
    } else {
      res.statusMessage = `No progress data found for user ${userId} and puzzle ${puzzleId}`;
      res.status(200).end();  
    }
  } catch (err) {
    res.status(200).json({ rows: err.stack });
   }
}


// POST /puzzles/:puzzleId/users/:userId
export const createUserProgress = async (req, res) => {  
  const puzzleId = parseInt(req.params.puzzleId);
  const userId = parseInt(req.params.userId);
  const { progress } = req.body;

  const columns = ['puzzleid', 'userid', 'progress'].join(',');
  const values = `${puzzleId}, ${userId}, '${progress}'`;
  console.log(columns);
  console.log(values);
  try {    
    const data = await model.create(columns, values);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(400).json({ data: err.stack });
  }
}

// PUT /puzzles/:id/users/:userId
export const updateUserProgress = async (req, res) => {
  const puzzleId = parseInt(req.params.puzzleId);
  const userId = parseInt(req.params.userId);
  
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
