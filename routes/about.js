import express from 'express'
const router = express.Router();

router.get('/', function (req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.render('about.html', {
    isProduction
  });
});

export default router;
