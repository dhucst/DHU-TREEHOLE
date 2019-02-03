const mongoose = require('../lib/database').database_conn;
const UserSchema = require('../lib/database').UserSchema;

const UserModel = mongoose.model('User', UserSchema);

exports.User = UserModel;
