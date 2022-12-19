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
import validator from 'express-validator';
import sesion from 'express-session';
import pkg from 'express';
import mongojs from 'mongojs'
//npm install mongojs

const express = pkg;
const app = express();
const port = 3000;
const db = mongojs('mongodb://127.0.0.1:27017/testProyecto', ["usuarios"])

app.use(sesion({
  secret: "1234",
  resave: true,
  saveUninitialized: true,
}))

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

/*
console.log("Usuarios registrados en el sistema:")
db.usuarios.find({}, (err, docs) => {
  if (err) {
    console.log(err)
  } else {
    console.log(docs)
  }
})
*/

app.get('/', (req, res) => {
  
  if (!req.session.inicializada) {
    res.render('login', {data: { elerror: "" }})
  } else {
    if (req.session.admin) {
      res.render('menuAdmin', {data: { email: req.session.usuario }});
    } else {
      res.render('game', {data: { email: req.session.usuario }}); // aqui iria la pagina de usuario normal (el juego en si)
    }
  }  
})

app.get('/login', (req, res) => {
/*
  db.usuarios.find({}, (err, docs) => {
    if (err) {
      console.log(err)
    } else {
      console.log(docs)
    }
  })
*/
  if (req.session.inicializada) {
    res.redirect('game', {data: { email: req.session.usuario }});
  } else {
    res.render('login', {data: { elerror: "" }})

  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('login')
});

app.get('/game', (req, res) => {
  if (req.session.inicializada) {
    res.render('game', {data: { email: req.session.usuario }})
  } else {
    res.redirect('login')
  }

});

app.get('/tratarFormCrear', (req, res) => { // crear jugadores nuevos
  
  if (req.session.admin) {
    res.render('formNewPlayers', {data: { elerror: "" }})
  } else {
    res.redirect('login')
  }
});

app.get('/crearUsuario', (req, res) => {  // crear cuentas de usuarios nuevas
  res.render('register', {data: { elerror: "" }})
})


// Ejercicio 6.1 - Registrar usuario
app.post("/crearUsuario",
  body('name').notEmpty(),
  body('name').isAlpha(),

  body('surname').notEmpty(),
  body('surname').isAlpha(),

  body('email').notEmpty(),
  body('email').isEmail(),
  
  body('password').notEmpty(),
  
  (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('register', {data: { elerror: "Validation Error. Por favor, introduzca correctamente los datos", nombre: req.body.name, apellido: req.body.surname, email: req.body.email }})
    } else {

      
      let eljson = JSON.stringify(req.body);
      
      // aqui se añadiria el usuario a la base de datos (si no existe ya)
      db.usuarios.insert({ name: req.body.name, surname: req.body.surname, email: req.body.email, password: req.body.password, admin: false }, (err, docs) => {
        if (err) {
          console.log(err)
        } else {
          //console.log(docs)
        }
      })
      console.log("Usuario nuevo añadido a la base de datos: \n" + eljson);
      
      res.redirect('login')
      
    }
  });
  
  // Ejercicio 6.1 - Login
app.post("/login",
  body('email').notEmpty(),
  body('email').isEmail(),

  body('pass').notEmpty(),

  (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('login', {data: { elerror: "Validation Error. Por favor, introduzca correctamente los datos", email: req.body.email }})
    }

    let resultado = db.usuarios.findOne({ "email": req.body.email, "password": req.body.pass }, (err, docs) => {
      if (docs == null) {
        res.render('login', {data: { elerror: "Email / Contraseña incorrectos", email: req.body.email }})
      } else {

        console.log("Usuario loggeado: " + req.body.email);

        req.session.usuario = docs.name + " " + docs.surname;
        req.session.inicializada = true;
        req.session.admin = docs.admin;

        if (req.session.admin) {
          res.render('menuAdmin', {data: { email: req.session.usuario }});
        } else {
          res.redirect('game');
        }
      }
    });
});


// Ejercicio 2.4
app.post("/tratarFormCrear",  // crear jugadores nuevos
  body('name').notEmpty(),
//  body('name').isAlpha(),

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
      res.render("formNewPlayers", {data: { elerror: "Validation Error. Por favor, introduzca correctamente los datos", nombre: req.body.name, fecha: req.body.birthdate, nacionalidad: req.body.nationality, equipo: req.body.teamID, posicion: req.body.position, dorsal: req.body.number, liga: req.body.leagueID }})
    } else {
      
      db.players.insert({ name: req.body.name, birthdate: req.body.birthdate, nationality: req.body.nationality, teamID: req.body.teamID, position: req.body.position, number: req.body.number, leagueID: req.body.leagueID }, (err, docs) => {
        if (err) {
          console.log(err)
        } else {
          //console.log(docs)
        }
      })
      
      let eljson = JSON.stringify(req.body);
      console.log("Jugador nuevo añadido a la base de datos: \n" + eljson);
      
      res.render('menuAdmin', {data: { email: req.session.usuario }})
  }
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



//Ejercicio 1.6 (url modificado de acuerdo con la aclaracion PRÁCTICA II - Nota importante)
// const data = JSON.parse(fs.readFileSync('./public/json/fullplayers.json', 'utf8'))
// let i = -1

// let inter = setInterval(() => {
//       if (i==data.length-2){
//         clearInterval(inter)
//       }
//   try{
//     if (i<data.length){
//       i=i+1
//       const url = `https://playfootball.games/media/players/${data[i].id%32}/${data[i].id}.png`
//       fetch(url).then(res => {
//         // console.log(res)
//         console.log(i)
//           if (res.status === 200) {
//             res.body.pipe(fs.createWriteStream(`${writepath3}${data[i].id}.png`, {flags:'a'}))
            
//           } else {
//             console.log(`status: ${res.status} line: ${i} elem:${data[i].id} not found`)
//           }
//         })
//     }
//   }catch(err){
//     console.error(err)
//   }

// }, 100);

var myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "015965833e9c4332188f0185f32e117f");
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

//Ejercicio 4
function ask(data,liga){
  let i = -1
  let inter = setInterval(() => {
    if (i==data.length-2){
      clearInterval(inter)
    }
    i=i+1
    fetch(`https://v3.football.api-sports.io/teams?id=${data[i].newId}`,requestOptions)
  .then(res => res.text()).then(res => {
    console.log(res)
    res = JSON.parse(res).response[0]
    console.log(res)
    res.team.id = data[i].teamId
    let fil = JSON.parse(fs.readFileSync(`./json/info/${liga}.txt`, 'utf8'))
    fil.push(res)
    fs.writeFileSync(`./json/info/${liga}.txt`, JSON.stringify(fil))
    console.log(fil)
  })
  .catch(error => console.log('error', error));
}, 6500);}

const data1 = JSON.parse(fs.readFileSync('./json/newid/fullBundesliga.json', 'utf8'))
const data2 = JSON.parse(fs.readFileSync('./json/newid/fullLaliga.json', 'utf8'))
const data3 = JSON.parse(fs.readFileSync('./json/newid/fullLigue1.json', 'utf8'))
const data4 = JSON.parse(fs.readFileSync('./json/newid/fullPremiere.json', 'utf8'))
const data5 = JSON.parse(fs.readFileSync('./json/newid/fullSerieA.json', 'utf8'))

//ask(data1,'fullBundesliga')
//ask(data2,'fullLaliga')
// ask(data3,'fullLigue1')
// ask(data4,'fullPremiere')
//ask(data5,'fullSerieA')

app.listen(port, () => console.log(`Servidor lanzado en el puerto ${port}!`))
