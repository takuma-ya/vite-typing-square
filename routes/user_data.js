import path from 'path'
import url from "node:url"
import fs from 'node:fs'
import express from 'express'
//import { range } from 'express/lib/request.js'
import knex from '../db/knex.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const router = express.Router();

const num_music = 20;

// すべてのスコアの合計を計算
const directoryPath = path.join(__dirname, '../public/jsons');
let totalScore;
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    let totalCount = 0;

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        
        if (path.extname(file) === '.json') {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const jsonArray = JSON.parse(data);
                
                if (Array.isArray(jsonArray)) {
                    totalCount += jsonArray.length;
                }
            } catch (error) {
                console.error(`Error reading or parsing ${file}:`, error);
            }
        }
    });

    console.log('Total count of elements:', totalCount);
    totalScore = totalCount * 100;
});

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
              totalScore: totalScore,
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
          totalScore: totalScore,
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
