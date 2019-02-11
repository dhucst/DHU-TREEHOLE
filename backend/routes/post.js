const express = require('express');
const Post = require('../models/posts').Post;
const router =  express.Router();

router.all('*', (req, res, next) => {
  if (req.user === 'Anonymous') {
    res.status(403);
    res.json({
      success: false,
      msg: 'Forbidden',
    });
    return;
  }
  next();
});

router.post('/new', (req, res) => {
  const time = new Date().getTime();
  const post = new Post({
    owner: req.user._id,
    createTime: time,
    updateTime: time,
    content: req.body.content,
    pictures: req.body.pictures,
    approves: [],
    comments: [],
    background: null,
    isAnonymous: req.body.isAnonymous,
  });
  post.save((err) => {
    if (err){
      res.status(500);
      res.json({
        success: false,
        msg: 'Server errors',
        id: null,
      });
      return;
    }
    res.json({
      success: true,
      msg: 'Success!',
      id: post._id,
      });
  })
});

router.route('/:postId')
  .delete((req, res, next) => {
    Post.findById(req.params.postId, (err, post) => {
      if (err || !post){
        next();
        return;
      }
      if (post.owner !== req.user._id){
        res.status(403);
        res.json({
          success: false,
          msg: 'Forbidden',
        });
        return;
      }
      Post.deleteOne({ _id: post._id }, (err) => {
        if (err){
          res.status(500);
          res.json({
            success: false,
            msg: 'Server errors',
          });
          return;
        }
        res.json({
          success: true,
          msg: 'Deleted!',
        });
      });
    });
  })
  .put((req, res, next) => {
    Post.findById(req.params.postId, (err, post) => {
      if (err || !post){
        next();
        return;
      }
      if (req.user._id !== post.owner) {
        res.status(403);
        res.json({
          success: false,
          msg: 'Forbidden',
        });
        return;
      }
      post.updateTime = new Date().getTime();
      post.content = req.body.content;
      post.pictures = req.body.pictures;
      post.save((err) => {
        if (err) {
            res.status(500);
            res.json({
              success: false,
              msg: 'Server errors',
            });
            return;
          }
          res.json({
            success: true,
            msg: 'Updated!',
          });
      });
    });
  })
  .get((req, res, next) => {
    Post.findById(req.params.postId, (err, post) => {
      if (err || !post){
        next();
        return;
      }
      const tmp = {
        owner: post.owner,
        createTime: post.createTime,
        updateTime: post.updateTime,
        content: post.content,
        pictures: post.pictures,
        approves: post.approves.length > 5 ? post.approves.slice(0, 5) : post.approves,
        approvesNum: post.approves.length,
        comments: post.comments.length > 3 ? post.comments.slice(0, 3) : post.comments,
        commentsNum: post.comments.length,
        background: post.background,
      };
      res.json({
        success: true,
        msg: tmp,
      });
    });
  });

router.get('/:postId/isApprove', (req, res, next) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err || !post){
      next();
      return;
    }
    if (post.approves.includes(req.user._id)) res.json({
      success: true,
      approved: true,
    });
    else res.json({
      success: true,
      approved: false,
    });
  });
});

router.put('/:postId/approve', (req, res, next) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err || !post){
      next();
      return;
    }
    if (!post.approves.includes(req.user._id)) post.approves.push(req.user._id);
    else post.approves.remove(req.user._id);
    post.save((err) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          approved: !post.approves.includes(req.user._id),
        });
        return;
      }
      res.json({
        success: true,
        approved: post.approves.includes(req.user._id),
      });
    });
  });
});

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    success: false,
    msg: 'Not found!',
  })
});

module.exports = router;