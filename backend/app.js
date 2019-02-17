require('dotenv').config();
require('serve-favicon');
require('./lib/database');
require('./lib/oss');
require('./lib/email');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const auth = require('./lib/auth');

const index = require('./routes/index');
const userRouter = require('./routes/user');
const users = require('./routes/users');
const profileRouter = require('./routes/profile');
const verifyRouter = require('./routes/verify');
const postRouter = require('./routes/post');
const pictureRouter = require('./routes/picture');
const commentRouter = require('./routes/comment');

const app = express();

app.listen(8999, '127.0.0.1');
console.log('listen on localhost:8999');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);

app.use('/', index);
app.use('/user', userRouter);
app.use('/profile', profileRouter);
app.use('/users', users);
app.use('/verify', verifyRouter);
app.use('/post', postRouter);
app.use('/picture', pictureRouter);
app.use('/comment', commentRouter);

// catch 404 and forward to error handler
/* app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
}); */

// error handler
/*app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
