import express from 'express'
import knex  from "../db/knex.js"
import bcrypt from "bcrypt"
const router = express.Router();

router.post('/', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    knex("users")
      .where({
        name: username,
      })
      .select("*")
      .then(async function (results) {
        if (results.length === 0) {
          req.session.error = 'ユーザが見つかりません';
          res.redirect("/");
        } else if (await bcrypt.compare(password, results[0].password)) {
          req.session.userid = results[0].id;
          res.redirect('/');
        } else {
          req.session.error = '合言葉が間違っています';
          res.redirect("/");
        }
      })
      .catch(function (err) {
        console.error(err);
        req.session.error = err.sqlMessage;
        res.redirect("/");
      });
  });

export default router;
