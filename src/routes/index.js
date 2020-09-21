import express from 'express';
import {
  createPuzzle,
  indexPage,
  listPuzzles,
  listUsers,
  showPuzzle,
  showUser,
  showUserProgress,
  // updateUserProgress,
} from '../controllers';
// import { modifyMessage } from '../middleware';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);

indexRouter.get('/users', listUsers);
indexRouter.get('/users/:id', showUser);

indexRouter.get('/users/:id/puzzles/:puzzleId', showUserProgress);
// indexRouter.put('/users/:id/puzzles/:puzzleId', updateUserProgress);

indexRouter.get('/puzzles', listPuzzles);
indexRouter.post('/puzzles', createPuzzle);
indexRouter.get('/puzzles/:id', showPuzzle);

// indexRouter.get('/messages', listMessages);
// indexRouter.post('/messages', modifyMessage, createMessage);

export default indexRouter;
