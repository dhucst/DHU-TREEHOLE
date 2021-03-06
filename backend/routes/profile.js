const express = require('express');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: './static/temp' });
const getByPages = require('../lib/utils').getByPages;
const OSS = require('../lib/oss');
const User = require('../models/users').User;
const Post = require('../models/posts').Post;

const router = express.Router();

router.use(upload.single('avatar'));

router.route('/:stdId')
  .put((req, res, next) => {
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
})
  .get((req, res, next) => {
    User.findOne({stdId: req.params.stdId}, (err, user) => {
      if (err || !user) {
        next();
        return;
      }
      res.json({
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        posts: user.posts.length,
        lastLogin: user.lastLogin,
        ip: user.ip,
      });
    });
  });

router.get('/:stdId/posts', (req, res, next) => {
  User.findOne({
    stdId: req.params.stdId,
  }, 'posts', (err, user) => {
    if (err || !user) {
      next();
      return;
    }
    const pages = req.query.pages ? req.query.pages : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    const newPostIdArray = getByPages(user.posts, limit, pages);
    Post.getAbstractsByIdArray(newPostIdArray, (err, results) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          msg: 'Server Errors.'
        });
        return;
      }
      res.json({
        success: true,
        msg: 'Get success!',
        collections: results,
      });
    });
  })
});

router.route('/collections')
  .put((req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err || !user) {
      next();
      return;
    }
    if (!user.collections.includes(req.body.postId)) user.collections.push(req.body.postId);
    else user.collections.remove(req.body.postId);
    user.save((err) => {
      if (err) {
        res.status(500);
        res.json({
          success: true,
          msg: 'Server Errors',
        });
        return;
      }
      res.json({
        success: true,
        msg: user.collections.includes(req.body.postId) ? 'Add collection successfully.' : 'Remove collection successfully',
        collected: user.collections.includes(req.body.postId),
      });
    });
  });
})
  .get((req, res, next) => {
    User.findById(req.user._id, 'collections', (err, user) => {
      if (err){
        res.status(500);
        res.json({
          success: false,
          msg: 'Server Errors.'
        });
        return;
      }
      const pages = req.query.pages ? req.query.pages : 1;
      const limit = req.query.limit ? req.query.limit : 10;
      const newPostIdArray = getByPages(user.collections, limit, pages);
      Post.getAbstractsByIdArray(newPostIdArray, (err, results) => {
        if (err) {
          res.status(500);
          res.json({
            success: false,
            msg: 'Server Errors.'
          });
          return;
        }
        res.json({
          success: true,
          msg: 'Get success!',
          collections: results,
        });
      });
    })
  });

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    success: false,
    msg: 'Not found.',
  });
});

module.exports = router;
