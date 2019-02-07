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
