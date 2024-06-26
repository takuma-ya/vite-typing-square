import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cookieSession from "cookie-session"
import route from "./routes/index.js"
import url from "node:url"
import ejs from "ejs"
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const secret = "secretCuisine123";

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: [secret],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// view engine setup
if (process.env.NODE_ENV === 'production') {
  app.set('views', path.join(__dirname, 'dist/views'));
}
else {
  app.set('views', path.join(__dirname, 'views'));
}
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile); //viteで解釈できるようにhtmlに変更

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', route);

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  next(createError(404));
});
*/

// error handler
/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

/**
 * Module dependencies.
 */

import debug from 'debug'
import viteExpress from 'vite-express'
import http from 'http'

var debuger = debug('typing-square:server');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
//app.set('port', port);

/**
 * Create HTTP server.
 */

//viteExpress.config({ mode: "production" })
//var server = viteExpress.listen(app, 3000, () => console.log("Server is listening..."));
viteExpress.listen(app, port, () => console.log("Server is listening..."));
//var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

//server.listen(port);
//server.on('error', onError);
//server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
/*
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
*/
  // handle specific listen errors with friendly messages
/*
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
*/

/**
 * Event listener for HTTP server "listening" event.
 */
/*
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debuger('Listening on ' + bind);
}
*/
