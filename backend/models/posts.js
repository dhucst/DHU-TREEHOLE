const async = require('async');

const mongoose = require('../lib/database').database_conn;
const PostSchema = require('../lib/database').PostSchema;

const PostModel = mongoose.model('Post', PostSchema);

function getAbstractById(postId, callback) {
  PostModel.findById(postId, (err, post) => {
    if (err || !post || post.isDeleted) {
      const tmp = {
        _id: postId,
        error: 'Unavailable!'
      };
      callback(null, tmp);
      return;
    }
    const tmp = {
      _id: postId,
      owner: post.owner,
      createTime: post.createTime,
      content: post.content,
      pictures: post.pictures.length ? post.pictures[0] : null,
      approves: post.approves.length >= 5 ? post.approves.slice(0,5) : post.approves,
      approveNum: post.approves.length,
      commentNum: post.comments.length,
      background: post.background,
      isAnonymous: post.isAnonymous,
    };
    callback(null, tmp)
  });
}

function getAbstractsByIdArray(postIdArray, callback) {
  async.times(postIdArray.length, (n, next) => {
    getAbstractById(postIdArray[n], (err, abstract) => {
      if (!abstract) {
        next(err, );
        return;
      }
      next(err, abstract);
    });
  },
    (err, abstracts) => {
      callback(null, abstracts);
    });
}

PostModel.getAbstractsByIdArray = getAbstractsByIdArray;

exports.Post = PostModel;
