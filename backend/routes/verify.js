const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/users').User;

const router = express.Router();

router.get('/signup/:token', (req, res) => {
  const token = Buffer.from(req.params.token, 'base64').toString();
  jwt.verify(token, process.env.mailTokenSecret, (err, decoded) => {
    if (err) {
      res.status(404);
      res.json({ error: 'Invalid!' });
    }
    if (decoded.doWhat === 'verifyEmail') {
      User.findById(decoded._id, (err, user) => {
        if (err) throw err;
        if (user) {
          user.verified = true;
          user.email = decoded.email;
          const tmp = {
            _id: user._id,
            name: user.name,
            email: decoded.email,
          };
          const newToken = jwt.sign(tmp, process.env.superSecret, {
            expiresIn: 60 * 60 * 24,
          });
          user.save();
          res.json({
            success: true,
            msg: 'Verify successfully!',
            token: newToken,
          });
        } else {
          res.status(404);
          res.json({
            success: false,
            msg: 'Not found.'
          });
        }
      });
    } else {
      res.status(404);
      res.json({
        success: false,
        msg: 'Not found.'
      });
    }
  });
});

module.exports = router;
