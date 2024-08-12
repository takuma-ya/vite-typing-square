import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cookieSession from "cookie-session"
import { createServer as createViteServer } from 'vite'
import url from "node:url"
import ejs from "ejs"
import fs from 'node:fs'
import knex from './db/knex.js'
import auth_status from './routes/auth_status.js'
import credit from './routes/credit.js'
import credit_en from './routes/credit_en.js'
import about from './routes/about.js'
import about_en from './routes/about_en.js'
import logout from './routes/logout.js'
import logout_en from './routes/logout_en.js'
import save_score from './routes/save_score.js'
import signin from './routes/signin.js'
import signin_en from './routes/signin_en.js'
import signup from './routes/signup.js'
import signup_en from './routes/signup_en.js'
import user_data from './routes/user_data.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const secret = "secretCuisine123";

const app = express();

async function createServer() {
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

  /**
   * Create HTTP server.
   */

  let vite
  if (process.env.NODE_ENV != 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(sirv('./dist', { extensions: [] }))
  }

  const router = express.Router();

  router.get('/', async function (req, res, next) {
    const isProduction = process.env.NODE_ENV === 'production';
    const url = req.originalUrl;
    const ssrManifest = isProduction
      ? fs.readFileSync('./dist/.vite/ssr-manifest.json', 'utf-8')
      : undefined
    try {
      let render
      if (process.env.NODE_ENV != 'production') {
        render = (await vite.ssrLoadModule('/src/main_ssr.jsx')).render;
      } else {
        render = (await import('./dist/server/main_ssr.js')).render;
      }

      const appHtml = await render(url, ssrManifest)

      res.render('index.html', {
        isProduction: isProduction,
      }, function (err, html) {
        res.send(html.replace(`<!--ssr-outlet-->`, appHtml))
      })

    } catch (e) {
      vite?.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  });

  router.get('/en/', async function (req, res, next) {
    const isProduction = process.env.NODE_ENV === 'production';
    const url = req.originalUrl;
    const ssrManifest = isProduction
      ? fs.readFileSync('./dist/.vite/ssr-manifest.json', 'utf-8')
      : undefined
    try {
      let render
      if (process.env.NODE_ENV != 'production') {
        render = (await vite.ssrLoadModule('/src/main_en_ssr.jsx')).render;
      } else {
        render = (await import('./dist/server_en/main_en_ssr.js')).render;
      }

      const appHtml = await render(url, ssrManifest)

      res.render('index_en.html', {
        isProduction: isProduction,
      }, function (err, html) {
        res.send(html.replace(`<!--ssr-outlet-->`, appHtml))
      })

    } catch (e) {
      vite?.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  });

  router.use('/auth_status', auth_status);
  router.use('/credit', credit);
  router.use('/en/credit', credit_en);
  router.use('/about', about);
  router.use('/en/about', about_en);
  router.use('/logout', logout);
  router.use('/en/logout', logout_en);
  router.use('/save_score', save_score);
  router.use('/signin', signin);
  router.use('/en/signin', signin_en);
  router.use('/signup', signup);
  router.use('/en/signup', signup_en);
  router.use('/user_data', user_data);

  app.use('/', router);
  /**
   * Get port from environment and store in Express.
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

  var port = normalizePort(process.env.PORT || '3000');
  app.listen(port);
}

createServer()
