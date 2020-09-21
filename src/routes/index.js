import express from 'express';
import {
  createPuzzle,
  indexPage,
  listPuzzles,
  listUsers,
  showPuzzle,
} from '../controllers';
// import { modifyMessage } from '../middleware';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);
indexRouter.get('/users', listUsers);

indexRouter.get('/puzzles', listPuzzles);
indexRouter.post('/puzzles', createPuzzle);
indexRouter.get('/puzzles/:id', showPuzzle);

// indexRouter.get('/messages', listMessages);
// indexRouter.post('/messages', modifyMessage, createMessage);

export default indexRouter;
