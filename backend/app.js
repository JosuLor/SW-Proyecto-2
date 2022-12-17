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

/*
const express = require('express');
//const mongojs = require('mongojs')
//const db = mongojs('mongodb://127.0.0.1:27017/test', ["inventory"])
const app = express();
//const port = 3000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
*/

import fs from 'fs';
import fetch, { isRedirect } from 'node-fetch'
import { createRequire } from 'module';
//import { express } from 'express';
import validator from 'express-validator';

import pkg from 'express';
const express = pkg;

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', './views');

var router = express.Router();
const { body, validationResult } = validator;

const writepath = 'json/leagues/'
const writepath2 = 'json/teams/'
const writepath3 = 'json/players/'
const writepath4 = 'json/flags/'

fs.mkdirSync(writepath,  { recursive: true })
fs.mkdirSync(writepath2, { recursive: true })
fs.mkdirSync(writepath3, { recursive: true })
fs.mkdirSync(writepath4, { recursive: true })

app.get('/', (req, res) => {
  res.render('formNewPlayers')
})

app.post("/tratarFormCrear", 
  body('name').notEmpty(),
  body('name').isAlpha(),

  body('birthdate').notEmpty(),
  
  body('nationality').notEmpty(),
  body('nationality').isAlpha(),
  
  body('teamID').notEmpty(),
  body('teamID').isNumeric(),
  
  body('position').notEmpty(),
  body('position').isAlpha(),

  body('number').notEmpty(),
  body('number').isNumeric(),

  body('leagueID').notEmpty(),
  body('leagueID').isNumeric(),

  (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send("Te voy a meter en un gulag, SIN COMIDA")
    }

    let eljson = JSON.stringify(req.body);
    console.log("Jugador nuevo añadido a la base de datos: \n" + eljson);

    // aqui se añadiria el jugador a la base de datos

    res.send("Se ha añadido el jugador a la base de datos: " + eljson);
})

/*
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
}

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
*/
/**
 * Method to obtain the files from the url and write them in the writepath
 * @param {*} name name of the file to read
 * @param {*} writepathX path to write the files
 * @param {*} url2 url to fetch the files
 */
// function obtain(name, writepathX, url2){
//   try{
//     const data = fs.readFileSync(name+'.txt', 'utf8').split("\n")
//     data.forEach((elem, idx) => {
//       let url 
//       let format
//       if(name == 'teamIDs'){
//         url = `${url2}/${elem%32}/${elem}.png`
//         format = '.png'
//       }
//       if(name == 'nationalities'){
//         url = `${url2}/${elem}.svg`
//         format = '.svg'
//       }
//       if(name == 'leagues'){
//         url = `${url2}/${elem}.png`
//         format = '.png'
//       }

//       fetch(url).then(res => {
//           // check status
//           if (res.status === 200) {
//             elem = elem.replace(/(\r\n|\n|\r)/gm, "")
//             res.body.pipe(fs.createWriteStream(`${writepathX}${elem}${format}`, {flags:'a'}))
//           } else {
//             console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
//           }})})
//   }catch(err){
//     console.error(err)
//   }
// }

//por alguna razón si se ponen los tres a la vez falla por problemas de conexión

// adicional
// try {
//   // read leagues file into an array of lines
//   obtain('leagues', writepath, 'https://playfootball.games/media/competitions')
// } catch (err) {
//   console.error(err);
// }

// Ejercicio 1.2 - adicional
// try{
//   // get the flags of all countries in nationalities.txt
//   obtain('nationalities', writepath4, 'https://playfootball.games/who-are-ya/media/nations')
// }catch(err){
//   console.error(err)
// }

//Ejercicio 1.4-5 - adicional
// try{
//   obtain('teamIDs', writepath2, 'https://cdn.sportmonks.com/images/soccer/teams')
// }catch(err){
//   console.error(err)
// }

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

// let i = 0



// //Ejercicio 1.6
const data = JSON.parse(fs.readFileSync('./fullplayers.json', 'utf8'))
let i = -1

let inter = setInterval(() => {
      if (i==data.length-2){
        clearInterval(inter)
      }
  try{
    // console.log(data.length)
    
    if (i<data.length){
      i=i+1
      // console.log(data[i])
      // console.log(`https://media.api-sports.io/football/players/${data[i].id}.png`)
      const url = `https://media.api-sports.io/football/players/${data[i].id}.png`
      fetch(url).then(res => {
        // console.log(res)
        console.log(i)
          if (res.status === 200) {
            res.body.pipe(fs.createWriteStream(`${writepath3}${data[i].id}.png`, {flags:'a'}))
            
          } else {
            console.log(`status: ${res.status} line: ${i} elem:${data[i].id} not found`)
          }
        })
    }
  }catch(err){
    console.error(err)
  }

}, 100);



app.listen(port, () => console.log(`Servidor lanzado en el puerto ${port}!`))
