const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/dhu_treehole';


mongoose.connect(DB_URL);

const Schema = mongoose.Schema;

exports.UserSchema = new Schema({
  stdId: String,
  nickname: String,
  email: String,
  avatar: String,
  verified: Boolean,
  password: String,
  posts: [String],
  lastLogin: Number,
  ip: String,
});

exports.PostSchema = new Schema({
  owner: String,
  createTime: Number,
  updateTime: Number,
  content: String,
  pictures: [String],
  approves: [String],
  comments: [String],
  background: String,
  isAnonymous: Boolean,
});

exports.CommentSchema = new Schema({
  owner: String,
  createTime: Number,
  content: String,
  post: String,
  replyTo: String,
  isAnonymous: Boolean,
});

exports.FakerSchema = new Schema({
  post: String,
  owner: String,
  fakeName: String,
});

exports.PictureSchema = new Schema({
  createTime: Number,
  url: String,
  type: String,
  MD5: String,
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open to ${DB_URL}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
});

exports.database_conn = mongoose;
