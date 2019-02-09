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
  });

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    success: false,
    msg: 'Not found!',
  })
});

module.exports = router;
