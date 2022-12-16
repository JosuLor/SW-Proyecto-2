/*
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
*/


import fs from 'fs';
import fetch from 'node-fetch'

const writepath = 'json/leagues/'

fs.mkdirSync(writepath, { recursive: true })

try {
  // read leagues file into an array of lines
  const data = fs.readFileSync('./json/leagues/leagues.txt', 'utf8').split("\n")
  data.forEach((elem, idx) => {
    const url = `https://playfootball.games/media/competitions/${elem}.png`
    fetch(url).then(res => {
        // check status
        if (res.status === 200) {
          res.body.pipe(fs.createWriteStream(`${writepath}${elem}.png`))
        } else {
          console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
        }
      })
      .catch(err => console.log(err))
  })
} catch (err) {
  console.error(err);
}