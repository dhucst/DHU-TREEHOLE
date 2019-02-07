const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const mailTransport = nodemailer.createTransport(process.env.mailConfig);

function sendVerifyEmailForSignUp(user) {
  user.doWhat = 'verifyEmail';
  const token = jwt.sign(user, process.env.mailTokenSecret, {
    expiresIn: 60 * 60 * 24 * 7,
  });
  const buff = Buffer.from(token);
  const encodedToken = buff.toString('base64');
  mailTransport.sendMail({
    from: process.env.mailFrom,
    to: user.email,
    subject: 'Message',
    text: `${process.env.baseUrl}/verify/signup/${encodedToken}`,
  });
}

function sendVerifyEmailForFindPwd(user) {
  user.doWhat = 'findPwd';
  const token = jwt.sign(user, process.env.mailTokenSecret, {
    expiresIn: 60 * 15,  //有效时间15分钟
  });
  const buff = Buffer.from(token);
  const encodedToken = buff.toString('base64');
  mailTransport.sendMail({
    from: process.env.mailFrom,
    to: user.email,
    subject: 'Message',
    text: `${process.env.baseUrl}/verify/findpwd/${encodedToken}`,
  });
}



exports.sendVerifyEmailForSignUp = sendVerifyEmailForSignUp;
exports.sendVerifyEmailForFindPwd = sendVerifyEmailForFindPwd;
