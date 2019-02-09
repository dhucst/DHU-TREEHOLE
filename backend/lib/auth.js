const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    req.user = 'Anonymous';
    next();
  } else {
    jwt.verify(token, process.env.superSecret, (err, decoded) => {
      if (err) {
        req.user = 'Anonymous';
        next();
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};
