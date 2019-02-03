const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users').User;

const router = express.Router();


router.post('/signup', (req, res) => {
  const user = new User({
    stdId: req.body.stdId,
    email: req.body.email,
    password: req.body.password,
  });
  user.save((err) => {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        msg: 'Failed.',
        token: null,
      });
    }
    const tmp = {
      _id: user._id,
      stdId: user.stdId,
    };
    jwt.sign(tmp, process.env.superSecret, {
      expiresIn: 60 * 60 * 24,
    }, (err, token) => {
      res.json({
        success: true,
        msg: 'success',
        token,
      });
    });
  });
});

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    msg: 'No found.',
  });
});

module.exports = router;
