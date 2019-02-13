const express = require('express');
const router = express.Router();
const Commernt = require('../models/comments').Comment;
const Post = require('../models/posts').Post;

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

router.post('/new', (req, res, next) => {
  Post.findById(req.body.postId, (err, post) => {
    if (err || !post){
      next();
      return;
    }
    const time = new Date().getTime();
    const comment = Commernt({
      owner: req.user._id,
      createTime: time,
      content: req.body.content,
      post: post._id,
      replies: [],
      isPrivate: req.body.isPrivate,
      isAnonymous: req.body.isAnonymous,
      isDeleted: false,
    });
    post.comments.push(comment._id);
    comment.save((err) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          msg: "Server Errors.",
        });
      } else {
        post.save((err) => {
          if (err) {
            res.status(500);
            res.json({
              success: false,
              msg: "Server Errors.",
            });
          } else {
            res.json({
              success: true,
              msg: "Success",
            });
          }
        });
      }
    });
  });
});

module.exports = router;
