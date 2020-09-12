import express from 'express';
import { indexPage, listMessages, createMessage } from '../controllers';
import { modifyMessage } from '../middleware';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);
indexRouter.get('/messages', listMessages);
indexRouter.post('/messages', modifyMessage, createMessage);

export default indexRouter;
