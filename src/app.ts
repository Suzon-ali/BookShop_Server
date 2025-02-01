import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundHandler from './app/middlewares/notFoundHandler';
import router from './app/routes';

const app: Application = express();

//parser
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://blog-sujon.netlify.app'],
    credentials: true,
  }),
);
app.use(cookieParser());

//router
app.use('/api/', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
