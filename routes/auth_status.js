import express from 'express'
import knex from '../db/knex.js'
const router = express.Router();

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
          res.json({
            userName: results_user[0].name,
            errorMessage: error,
            isAuth: isAuth,
          });
        })
        .catch(function (err) {
          console.error(err);
          res.json({
            errorMessage: error,
            isAuth: isAuth,
          });
        });
  } else {
      res.json({
        errorMessage: error,
        isAuth: isAuth,
      });
  }
});

export default router;
