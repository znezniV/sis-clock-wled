import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';
import createError from 'http-errors';
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import apiRounter from './routes/api.js';
import shared from './shared.js';

const app = express();
const eventEmitter = new EventEmitter();
// Convert the current module URL to a file path
const __filename = fileURLToPath(import.meta.url);
// Derive the directory name from the file path
const __dirname = dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', apiRounter(eventEmitter));

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

eventEmitter.on('event:clock_updated', handleClockUpdated);

function handleClockUpdated() {
  console.log(shared.led_duration)
}

export { app, eventEmitter };
