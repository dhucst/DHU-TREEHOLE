const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users').User;
const ifStdIdEmailValid = require('../models/users').ifStdIdEmailValid;
const sendVerifyEmailForSignUp = require('../lib/email').sendVerifyEmailForSignUp;
const sendVerifyEmailForFindPwd = require('../lib/email').sendVerifyEmailForFindPwd;

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
          nickname: req.body.stdId,
          ip: req.ip,
          verified: false,
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
            email: user.email,
          };
          sendVerifyEmailForSignUp(tmp);
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

router.post('/login', (req, res) => {
  User.findOne({ stdId: req.body.stdId }, (err, user) => {
    if (err || !user) {
      res.status(403);
      res.json({
        success: false,
        msg: '学号或密码错误',
        token: null,
      });
      return;
    }
    bcrypt.compare(req.body.password, user.password, (err, flag) => {
      if (err || !flag) {
        res.status(403);
        res.json({
          success: false,
          msg: '学号或密码错误',
          token: null,
        });
      } else {
        const tmp = {
          _id: user._id,
          stdId: user.stdId,
        };
        user.ip = req.ip;
        user.lastLogin = new Date().getTime();
        jwt.sign(tmp, process.env.superSecret, {
          expiresIn: 60 * 60 * 24,
        }, (err, token) => {
          user.save();
          res.json({
            success: true,
            msg: 'success',
            token,
          });
        });
      }
    })
  })
});

router.post('/findpwd', (req, res) => {
  User.findOne({ stdId: req.body.stdId }, (err, user, next) => {
    if (err || !user) {
      next();
      return;
    }
    if (!user.verified || (req.body.email !== user.email)) {
      res.status(403);
      res.json({
        success: false,
        msg: 'email地址有误或不存在',
      });
      return;
    }
    const tmp = {
      _id: user._id,
      stdId: user.stdId,
      email: user.email,
    };
    sendVerifyEmailForFindPwd(tmp);
    res.json({
      success: true,
      msg: '邮件已发送。'
    });
  });
});

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    msg: 'Not found.',
  });
});

module.exports = router;
