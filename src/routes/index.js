import express from 'express';
import {
  listUsers,
  indexPage,
  listMessages,
  createMessage
} from '../controllers';
import { modifyMessage } from '../middleware';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);
indexRouter.get('/users', listUsers);
indexRouter.get('/messages', listMessages);
indexRouter.post('/messages', modifyMessage, createMessage);

export default indexRouter;
