import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRouter from './routes/index';

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'))
app.use('/api', indexRouter);

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.stack });
});

export default app;
