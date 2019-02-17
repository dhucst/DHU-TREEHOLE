const mongoose = require('../lib/database').database_conn;
const PictureSchema = require('../lib/database').PictureSchema;

const PictureModel = mongoose.model('Picture', PictureSchema);

function ifHashExist(hash, callback) {
  PictureModel.findOne({hash: hash}, (err, picture) => {
    if (err || !picture) callback(null, false);
    else callback(null, picture);
  });
}

PictureModel.ifHashExist = ifHashExist;

exports.Picture = PictureModel;
