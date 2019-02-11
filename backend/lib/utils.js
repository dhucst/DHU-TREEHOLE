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

exports.computeHash = computeHash;
