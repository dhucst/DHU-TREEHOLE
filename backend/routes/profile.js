const express = require('express');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: './static/temp' });
const OSS = require('../lib/oss');
const User = require('../models/users').User;

const router = express.Router();

router.use(upload.single('avatar'));

router.put('/:stdId', (req, res, next) => {
  User.findOne({ stdId: req.params.stdId}, (err, user) => {
    if (err || !user) {
      next();
      return;
    }
    if (req.file) {
      try {
        OSS.put(user.stdId.toString() + ".avatar", req.file.path);
        fs.unlinkSync(req.file.path);
      } catch (e) {
        res.status(500);
        res.json({
          success: false,
          msg: "Server Errors.",
        });
      }
      user.avatar = process.env.ossBaseUrl + user.stdId.toString() + ".avatar";
    }
    if (req.body.nickname) user.nickname = req.body.nickname;
    if (req.body.motto) user.motto = req.body.motto;
    user.save((err) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          msg: "Server Errors.",
        });
        return;
      }
      res.json({
        success: true,
        msg: 'Update successfully.'
      });
    });
  });
});

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    success: false,
    msg: 'Not found.',
  });
});

module.exports = router;
