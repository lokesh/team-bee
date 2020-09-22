import express from 'express';
import {
  indexPage,
  listUsers,
  showUser,
  listPuzzles,
  createPuzzle,
  showPuzzle,
  listUsersProgress,
  showUserProgress,
  createUserProgress,
  updateUserProgress,
} from '../controllers';
// import { modifyMessage } from '../middleware';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);

indexRouter.get('/users', listUsers);
indexRouter.get('/users/:id', showUser);

indexRouter.get('/puzzles', listPuzzles);
indexRouter.post('/puzzles', createPuzzle);
indexRouter.get('/puzzles/:id', showPuzzle);

indexRouter.get('/puzzles/:id/users', listUsersProgress);
indexRouter.get('/puzzles/:puzzleId/users/:userId', showUserProgress);
indexRouter.post('/puzzles/:puzzleId/users/:userId', createUserProgress);
indexRouter.put('/puzzles/:puzzleId/users/:userId', updateUserProgress);

export default indexRouter;
