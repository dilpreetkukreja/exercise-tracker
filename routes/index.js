const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(__dirname);
  res.render('index');
  // res.render('index');
});

module.exports = router;
