import dotenv from 'dotenv';
import express, { type Express } from 'express';
import passport from 'passport';
import mainRouter from './routers/main.router.js';
import { notFound } from './controllers/404.controller.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(passport.initialize());

app.use(mainRouter);
app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT, (): void => {
  console.log(`Server is running on port ${process.env.PORT}`);
});