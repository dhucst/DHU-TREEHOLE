const mongoose =require('../lib/database').database_conn;
const CommentSchema = require('../lib/database').CommentSchema;
const CommentModel = mongoose.model('Comment', CommentSchema);

exports.Comment = CommentModel;
