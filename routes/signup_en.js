import express from 'express'
import knex from '../db/knex.js'
import bcrypt from "bcrypt"
const router = express.Router();

router.post('/', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    knex("users")
      .where({name: username})
      .select("*")
      .then(async function (result) {
        if (result.length !== 0) {
          req.session.error = 'This username is already in use.';
          res.redirect("/en");
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            knex("users")
              .insert({name: username, password: hashedPassword})
              .then(function () {
                knex("users")
                  .where({
                    name: username,
                  })
                  .select("*")
                  .then(async function (results) {
                    req.session.userid = results[0].id;
                    res.redirect("/en");
                  })
              })
            }
      })
      .catch(function (err) {
        console.error(err);
        req.session.error = err.sqlMessage;
        res.redirect("/en");
      });
  });

export default router;
