var express = require('express');
var router = express.Router();
var session = require('express-session');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/testProyecto', ["usuarios", "players"])
var validator = require('express-validator');

const { body, validationResult } = validator;

router.use(session({
  secret: "1234",
  resave: true,
  saveUninitialized: true,
}))

console.log("Usuarios registrados en el sistema:")
db.usuarios.find({}, (err, docs) => {
  if (err) {
    console.log(err)
  } else {
    console.log(docs)
  }
})

router.get('/', (req, res) => {
  //req.session.usuario = docs.name + " " + docs.surname;
  //req.session.inicializada = false;
  //req.session.admin = docs.admin;
  if (!req.session.inicializada) {
    res.render('login', {data: { elerror: "" }})
  } else {
    if (req.session.admin) {
      res.render('menuAdmin', {data: { email: req.session.usuario }});
    } else {
      res.redirect('http://localhost:3000/');
      //res.redirect('https://sw.jlorenzo015.eus/');
      //app.restart();
      //res.render('game', {data: { email: req.session.usuario }}); // aqui iria la pagina de usuario normal (el juego en si)
    }
  }  
})

router.get('/login', (req, res) => {
  if (req.session.inicializada) {
    res.redirect('http://localhost:3000/');
    //res.redirect('https://sw.jlorenzo015.eus/');
    //res.redirect('game', {data: { email: req.session.usuario }});
  } else {
    res.render('login', {data: { elerror: "" }})
  }
});

router.get('/logout', (req, res) => {
  
  if (req.session.inicializada) {
    req.session.destroy();
    res.render('logout')
  } else {
    res.render('login', {data: { elerror: "" }})
  }
});

router.get('/game', (req, res) => {
  if (req.session.inicializada) {
    res.redirect('http://localhost:3000/');
    //res.redirect('https://sw.jlorenzo015.eus/');
    //res.render('game', {data: { email: req.session.usuario }})
  } else {
    res.redirect('login')
  }
});

// crear cuentas de usuarios nuevas
router.get('/crearUsuario', (req, res) => {  
  res.render('register', {data: { elerror: "" }})
})

// Ejercicio 6.1 - Registrar usuario
router.post("/crearUsuario",
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
    
      db.usuarios.insert({ name: req.body.name, surname: req.body.surname, email: req.body.email, password: req.body.password, admin: false }, (err, docs) => {
        if (err) {
          console.log(err)
        } else {
          console.log(docs)
        }
      })
      console.log("Usuario nuevo añadido a la base de datos: \n" + eljson);
      
      res.redirect('login') 
    }
  });
  
// Ejercicio 6.1 - Login
router.post("/login",
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
          res.redirect('http://localhost:3000/');
          //res.redirect('https://sw.jlorenzo015.eus/');
        }
      }
    });
});

module.exports = router;
