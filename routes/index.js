import express from 'express'
import knex from '../db/knex.js'
import auth_status from './auth_status.js'
import credit from './credit.js'
import credit_en from './credit_en.js'
import logout from './logout.js'
import logout_en from './logout_en.js'
import save_score from './save_score.js'
import signin from './signin.js'
import signin_en from './signin_en.js'
import signup from './signup.js'
import signup_en from './signup_en.js'
import user_data from './user_data.js'
const router = express.Router();

router.get('/', function (req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.render('index.html', {
    isProduction
  });
});

router.get('/en/', function (req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.render('index_en.html', {
    isProduction
  });
});

router.use('/auth_status', auth_status);
router.use('/credit', credit);
router.use('/en/credit', credit_en);
router.use('/logout', logout);
router.use('/en/logout', logout_en);
router.use('/save_score', save_score);
router.use('/signin', signin);
router.use('/en/signin', signin_en);
router.use('/signup', signup);
router.use('/en/signup', signup_en);
router.use('/user_data', user_data);

export default router;
