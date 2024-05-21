import express from 'express'
import knex from '../db/knex.js'
import auth_status from './auth_status.js'
import credit from './credit.js'
import logout from './logout.js'
import save_score from './save_score.js'
import signin from './signin.js'
import signup from './signup.js'
import user_data from './user_data.js'
const router = express.Router();

router.get('/', function (req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.render('index.html', {
    isProduction
  });
});

router.use('/auth_status', auth_status);
router.use('/credit', credit);
router.use('/logout', logout);
router.use('/save_score', save_score);
router.use('/signin', signin);
router.use('/signup', signup);
router.use('/user_data', user_data);

export default router;
