const mongoose = require('../lib/database').database_conn;
const UserSchema = require('../lib/database').UserSchema;

const UserModel = mongoose.model('User', UserSchema);

function ifStdIdValid(stdId, callback) {
  UserModel.findOne({
    stdId,
  }, (err, user) => {
    callback(null, !user);
  });
}

function ifStdIdEmailValid(stdId, Email, callback) {
  ifStdIdValid(stdId, (err, flag) => {
    if (!flag) callback(null, false);
    else {
      UserModel.findOne({
        email: Email.toLocaleLowerCase(),
      }, (err, user) => {
        callback(null, !user);
      });
    }
  });
}

UserModel.ifStdIdEmailValid = ifStdIdEmailValid;

exports.User = UserModel;
