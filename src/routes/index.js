import express from 'express';
import { indexPage, listMessages, createMessage } from '../controllers';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);
indexRouter.get('/messages', listMessages);
indexRouter.post('/messages', createMessage);

export default indexRouter;
