import express from 'express'
//import { range } from 'express/lib/request.js'
import knex from '../db/knex.js'
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
    knex("scores")
      .max({score: "score", rate:"rate"})
      .select("music_id")
      .where({user_id: userId})
      .groupBy("music_id")
      .then(function (results_score) {
        knex("users")
          .select("name")
          .where({id: userId})
          .then(function (results_user) {
            let scores = Array(num_music);
            scores.fill(0);
            let rates = Array(num_music);
            rates.fill(0);
            for (let i = 0; i < results_score.length; i++) {
              let music_id = results_score[i].music_id;
              scores[music_id-1] = results_score[i].score;
              rates[music_id-1] = results_score[i].rate;
            }
            res.json({ 
              score: scores,
              rate: rates,
              isAuth: isAuth, 
              userName: results_user[0].name, 
              errorMessage: error
            }); 
          })
      })
      .catch(function (err) {
        console.error(err);
        let scores = Array(num_music);
        scores.fill(-1);
        let rates = Array(num_music);
        rates.fill(-1);
        res.json({ 
          score: scores,
          rate: rates,
          isAuth: isAuth, 
          userName: "", 
          errorMessage: error
        }); 
      });
  } else {
    let scores = Array(num_music);
    scores.fill(0);
    let rates = Array(num_music);
    rates.fill(0);
    res.json({ 
      score: scores,
      rate: rates,
      isAuth: isAuth, 
      userName: "", 
      errorMessage: error
    }); 
  }
});

export default router;
