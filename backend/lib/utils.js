const crypto = require('crypto');
const fs = require('fs');

function computeHash(filePath, callback) {
  let stream = fs.createReadStream(filePath);
  const fsHash = crypto.createHash('md5');

  stream.on('data', function(d) {
    fsHash.update(d);
  });

  stream.on('end', function() {
    const md5 = fsHash.digest('hex');
    callback(null, md5);
  });
}

function getByPages(array, limit, page) {
  let newArray = [];
  if (array.length <= limit * (page - 1)) {
    if (array.length <= limit * (page - 2)) newArray = [];
  } else {
    newArray = array.slice(limit * (page - 1), limit * page);
  }
  return newArray;
}

exports.getByPages = getByPages;
exports.computeHash = computeHash;
