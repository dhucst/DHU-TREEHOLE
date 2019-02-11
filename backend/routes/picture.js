const express = require('express');
const OSS = require('../lib/oss');
const router = express.Router();
const Picture = require('../models/pictures').Picture;
const ifHashExist = require('../models/pictures').ifHashExist;
const computeHash = require('../lib/utils').computeHash;
const multer = require('multer');
const fs = require('fs');


const upload = multer({ dest: './static/temp' });

router.use(upload.single('picture'));

router.all('*', (req, res, next) => {
  if (req.file)  {
    computeHash(req.file.path, (err, hash) => {
      if (err) {
        res.status(500);
        res.json({
          success: false,
          msg: "Server errors.",
        });
        return;
      }
      req.file.hash = hash;
      next();
    })
  } else next();
});

router.post('/upload', (req, res) => {
  ifHashExist(req.file.hash, (err, picture) => {
    if (!picture) {
      const newPicture = Picture({
        format: req.body.format,
        createTime: new Date().getTime(),
        type: req.body.type,
        ref: 1,
      });
      try {
        OSS.put(req.file.filename, req.file.path);
        fs.unlinkSync(req.file.path);
      } catch (e) {
        res.status(500);
        res.json({
          success: false,
          msg: "Server Errors.",
        });
      }
      newPicture.url = process.env.ossBaseUrl + req.file.filename;
      newPicture.hash = req.file.hash;
      newPicture.save((err) => {
        if (err) {
          res.status(500);
          res.json({
            success: false,
            msg: "Server Errors.",
          });
          return;
        }
        res.json({
          success: true,
          pictureId: newPicture._id,
        });
      });
    } else {
      picture.ref += 1;
      picture.save((err) => {
        if (err) {
          res.status(500);
          res.json({
            success: false,
            msg: "Server Errors.",
          });
          return;
        }
        res.json({
          success: true,
          pictureId: picture._id,
        });
      });
    }
  })
});

router.get('/hash', (req, res) => {
  ifHashExist(req.query.hash, (err, flag) => {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        msg: "Server errors.",
      });
      return;
    }
    if (flag) {
      res.json({
        success: true,
        exist: true,
      });
    } else {
      res.json({
        success: true,
        exist: false,
      });
    }
  });
});

module.exports = router;
