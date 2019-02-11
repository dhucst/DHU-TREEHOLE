const mongoose = require('../lib/database').database_conn;
const PostSchema = require('../lib/database').PostSchema;

const PostModel = mongoose.model('Post', PostSchema);

exports.Post = PostModel;
