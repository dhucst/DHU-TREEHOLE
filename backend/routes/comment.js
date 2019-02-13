const express = require('express');
const router = express.Router();
const Commernt = require('../models/comments').Comment;
const Post = require('../models/posts').Post;
const Reply = require('../models/replies').Reply;

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

router.post('/:commentId/reply', (req, res, next) => {
  Commernt.findById(req.params.commentId, (err, comment) => {
    if (err || !comment) {

      next();
      return;
    }
    const time = new Date().getTime();
    const reply = Reply({
      owner: req.user._id,
      createTime: time,
      post: comment.post,
      comment: comment._id,
      content: req.body.content,
      replyTo: req.body.replyTo,
      isPrivate: req.body.isPrivate,
      isAnonymous: req.body.isAnonymous,
      isDeleted: false,
    });
    comment.replies.push(reply._id);
    reply.save((err) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          msg: 'Server errors',
        });
      } else {
        comment.save((err) => {
          if (err) {
            res.status(500);
            res.json({
              success: false,
              msg: 'Server errors',
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

router.route('/:commentId')
  .delete((req, res, next) => {
    Commernt.findById(req.params.commentId, (err, comment) => {
      if (err || !comment) {
        next();
        return;
      }
      if (req.user._id !== comment.owner) {
        res.status(403);
        res.json({
          success: false,
          msg: 'Forbidden',
        });
        return;
      }
      comment.isDeleted = true;
      comment.save((err) => {
        if (err) {
          res.status(500);
          res.json({
            success: false,
            msg: 'Server errors',
          });
        } else {
          res.json({
            success: true,
            msg: "Success",
          });
        }
      })
    });
  });

module.exports = router;
