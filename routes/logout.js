import express from 'express'
const router = express.Router();

router.get('/', function (req, res, next) {
  req.session = null;
  res.redirect('/');
});

export default router
