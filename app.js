import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Convert the current module URL to a file path
const __filename = fileURLToPath(import.meta.url);
// Derive the directory name from the file path
const __dirname = dirname(__filename);

import createError from 'http-errors';
import express from 'express'

import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import ViteExpress from "vite-express"

import indexRouter from './routes/index.js';
import apiRounter from './routes/api.js';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.static(path.join(__dirname, '/dist/javascript')));
app.use(express.static(path.join(__dirname, '/dist/javascript/main.js')));

app.use('/', apiRounter);
// app.use('/api', apiRounter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));

export default app;
