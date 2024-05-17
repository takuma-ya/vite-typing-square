import express from 'express'
//import { range } from 'express/lib/request.js'
import knex from '../db/knex.js'
import signup from './signup.js'
import signin from './signin.js'
import logout from './logout.js'
import save_score from './save_score.js'
import credit from './credit.js'
import score from './score.js'
const router = express.Router();

const num_music = 10;

router.get('/', function (req, res, next) {
  let userId = req.session.userid;
  let isAuth = Boolean(userId);
  let error = req.session.error;
  if (Boolean(error)) {
    delete req.session.error;
  }
  if (isAuth) {
      knex("users")
        .select("name")
        .where({id: userId})
        .then(function (results_user) {
          res.render('index', {
            userName: results_user[0].name,
            errorMessage: error,
            isAuth: isAuth,
          });
        })
        .catch(function (err) {
          console.error(err);
          res.render('index', {
            errorMessage: error,
            isAuth: isAuth,
          });
        });
  } else {
    res.render('index', {
      errorMessage: error,
      isAuth: isAuth,
    });
  }
});

router.use('/signup', signup);
router.use('/signin', signin);
router.use('/logout', logout);
router.use('/save_score', save_score);
router.use('/credit', credit);
router.use('/score', score);

export default router;
