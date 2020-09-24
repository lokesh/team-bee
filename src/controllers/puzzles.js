import debug from 'debug';
import Model from '../models/model';
const model = new Model('puzzles');

// GET /puzzles
export const listPuzzles = async (req, res) => {
  try {
    const data = await model.select('*');
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(400).json({ data:err.stack });
  }
}

// POST /puzzles
export const createPuzzle = async (req, res) => {  
  const columns = ['name', 'center_letter', 'outer_letters', 'answers'].join(',');
  const { name, centerLetter, outerLetters, answers } = req.body;
  const values = `'${name}', '${centerLetter}', '{${outerLetters}}', '{${answers}}'`;
  console.log(columns);
  console.log(values);
  
  try {    
    const data = await model.create(columns, values);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(400).json({ data: err.stack });
  }
}

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
    res.status(400).json({ data:err.stack });
  }
}


// GET /puzzles/id/progress
