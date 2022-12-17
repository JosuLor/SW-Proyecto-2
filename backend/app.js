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
const writepath2 = 'json/teams/'
const writepath3 = 'json/players/'
const writepath4 = 'json/flags/'

fs.mkdirSync(writepath, { recursive: true })

try {
  // read leagues file into an array of lines
  const data = fs.readFileSync('leagues.txt', 'utf8').split("\n")
  data.forEach((elem, idx) => {
    const url = `https://playfootball.games/media/competitions/${elem}.png`
    fetch(url).then(res => {
        // check status
        if (res.status === 200) {
          elem = elem.replace(/(\r\n|\n|\r)/gm, "")
          res.body.pipe(fs.createWriteStream(`${writepath}${elem}.png`, {flags:'a'}))
        } else {
          console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
        }
      })
      .catch(err => console.log(err))
  })
} catch (err) {
  console.error(err);
}
/*
// Ejercicio 1.2
try{
  // get the flags of all countries in nationalities.txt
  const data = fs.readFileSync('nationalities.txt', 'utf8').split("\n")
  data.forEach((elem, idx) => {
    console.log(`https://playfootball.games/who-are-ya/media/nations/${elem}.svg`)
    const url = `https://playfootball.games/who-are-ya/media/nations/${elem}.svg`
    fetch(url).then(res => {
        // check status

        if (res.status === 200) {
          elem = elem.replace(/(\r\n|\n|\r)/gm, "")
          
          res.body.pipe(fs.createWriteStream(`${writepath4}${elem}.svg`, {flags:'a'}))
        } else {
          console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
        }})})
}catch(err){
  console.error(err)
}*/
/*
//Ejercicio 1.4-5
try{
  const data = fs.readFileSync('teamIDs.txt', 'utf8').split("\n")
  data.forEach((elem, idx) => {
    console.log(`https://cdn.sportmonks.com/images/soccer/teams/${elem%32}/${elem}.png`)
    const url = `https://cdn.sportmonks.com/images/soccer/teams/${elem%32}/${elem}.png`
    fetch(url).then(res => {
        // check status

        if (res.status === 200) {
          elem = elem.replace(/(\r\n|\n|\r)/gm, "")
          
          res.body.pipe(fs.createWriteStream(`${writepath2}${elem}.png`, {flags:'a'}))
        } else {
          console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
        }})})
}catch(err){
  console.error(err)
}
let i = 0
*/
//Ejercicio 1.6 no funciona

// try{
  // fetch('./fullplayers.json').then(res=>res.json()).then(res => {
  //   console.log(res)})
//   const data = fs.readFileSync('../frontend/json/fullplayers.json', 'utf8')
//   console.log(data.length)
//   console.log(data[5])
//   data.forEach((elem, idx) => {
//     console.log(elem)
//     elem = JSON.parse(elem)
//     console.log(`https://media.api-sports.io/football/players/${elem}.png`)
//     const url = `https://media.api-sports.io/football/players/${elem}.png`
//     fetch(url).then(res => {
//         // check status
//         i++
//         if (i==100){
//           i=0
//           sleep(100)
//         }
//         if (res.status === 200) {
//           elem = elem.replace(/(\r\n|\n|\r)/gm, "")
//           res.body.pipe(fs.createWriteStream(`${writepath3}${elem}.png`, {flags:'a'}))
//         } else {
//           console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
//         }})})
// }catch(err){
//   console.error(err)
// }
