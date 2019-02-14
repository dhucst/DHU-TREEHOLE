const mongoose = require('../lib/database').database_conn;
const PostSchema = require('../lib/database').PostSchema;

const PostModel = mongoose.model('Post', PostSchema);

function getAbstractById(postId, callback) {
  PostModel.findById(postId, (err, post) => {
    if (err || !post) {
      callback(err ? err : null, null);
      return;
    }
    const tmp = {
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

PostModel.getAbstractById = getAbstractById;

exports.Post = PostModel;
