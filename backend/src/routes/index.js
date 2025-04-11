import express from 'express';
import {
  indexPage,
  listUsers,
  showUser,
  listPuzzles,
  createPuzzle,
  showPuzzle,
  deletePuzzle,
  listUsersProgress,
  showUserProgress,
  createUserProgress,
  updateUserProgress,
} from '../controllers/index.js';
// import { modifyMessage } from '../middleware';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);

indexRouter.get('/users', listUsers);
indexRouter.get('/users/:id', showUser);

indexRouter.get('/puzzles', listPuzzles);
indexRouter.post('/puzzles', createPuzzle);
indexRouter.get('/puzzles/:id', showPuzzle);
indexRouter.delete('/puzzles/:id', deletePuzzle);

indexRouter.get('/puzzles/:puzzle_id/users', listUsersProgress);
indexRouter.get('/puzzles/:puzzle_id/users/:user_id', showUserProgress);
indexRouter.post('/puzzles/:puzzle_id/users/:user_id', createUserProgress);
indexRouter.put('/puzzles/:puzzle_id/users/:user_id', updateUserProgress);

export default indexRouter;
