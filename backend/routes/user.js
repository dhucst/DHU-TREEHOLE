const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users').User;
const ifStdIdEmailValid = require('../models/users').ifStdIdEmailValid;

const router = express.Router();


router.post('/signup', (req, res) => {
  ifStdIdEmailValid(req.body.stdId, req.body.email.toLocaleLowerCase(), (err, flag) => {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        msg: 'Failed.',
        token: null,
      });
      return;
    }
    if (!flag) {
      res.status(403);
      res.json({
        success: false,
        msg: '学号/邮箱非法或已注册',
        token: null,
      });
    } else {
      bcrypt.hash(req.body.password, parseInt(process.env.saltRounds, 10), (err, encoded) => {
        if (err) {
          res.status(500);
          res.json({
            success: false,
            msg: 'Failed.',
            token: null,
          });
          return;
        }
        const user = new User({
          stdId: req.body.stdId,
          email: req.body.email.toLocaleLowerCase(),
          password: encoded,
        });
        user.save((err) => {
          if (err) {
            res.status(500);
            res.json({
              success: false,
              msg: 'Failed.',
              token: null,
            });
            return;
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
    }
  });
});

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    msg: 'No found.',
  });
});

module.exports = router;
