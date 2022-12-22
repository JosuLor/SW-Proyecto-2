var express = require('express');
var router = express.Router();
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/testProyecto', ["usuarios", "players"])

// import validator from 'express-validator';
var validator = require('express-validator');

const { body, validationResult } = validator;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// remove player by ID
router.get('/remove/:id', async (req, res, next) => {
  console.log("Jugador eliminado")
     
  db.players.remove({ id: parseInt(req.params.id) });
 
  res.render('menuAdmin', {data: { email: req.session.usuario }})
/*
  db.players.remove({ id: _playerID}, (err, docs) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Jugador eliminado")
    }
  })*/
});

// edit player by ID
router.get('/edit/:id', async (req, res, next) => {
  if (req.session.admin) {
    let _playerID = parseInt(req.params.id);
    db.players.find({ id: _playerID }, (err, docs) => {
      if (err) {
        console.log(err)
      } else {
        //res.send(JSON.parse(docs));
        res.render('formNewPlayers', {data: { elerror: "", playerid: docs[0].id, nombre: docs[0].name, fecha: docs[0].birthdate, nacionalidad: docs[0].nationality, equipo: docs[0].teamId, posicion: docs[0].position, dorsal: docs[0].number, liga: docs[0].leagueId, accion: "edit", metodo: "POST", mongoid: docs[0]._id }})
      }
    })  
  } else {
    res.redirect('login')
  }
});

// edit player by ID
router.post("/edit", async (req, res, next) => {
  // hacer el render de formNewPlayers con los datos del jugador
  console.log("mongoID: " + req.body.mongoid)
  let _mongoID = req.body.mongoid;

  db.players.update({ _id: mongojs.ObjectId(_mongoID) }, { $set: { id:parseInt(req.body.playerid), name: req.body.name, birthdate: req.body.birthdate, nationality: req.body.nationality, teamId: parseInt(req.body.teamID), position: req.body.position, number: parseInt(req.body.number), leagueId: parseInt(req.body.leagueID)}}, (err, docs) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Jugador actualizado");
    }
  })

  res.render('menuAdmin', {data: { email: req.session.usuario }})
});

// crear jugadores nuevos
router.get('/add', (req, res) => {
  if (req.session.admin) {
    //res.send("fsdgsdfgsdfgsdfg
    res.render('formNewPlayers', {data: { elerror: "", accion: "add", metodo: "POST" }})
  } else {
    res.redirect('login')
  }
});

// crear jugadores nuevos
router.post("/add",  
  body('playerid').notEmpty(),
  body('playerid').isNumeric(),

  body('name').notEmpty(),

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
      res.render("formNewPlayers", {data: { elerror: "Validation Error. Por favor, introduzca correctamente los datos", playerid: req.body.playerid, nombre: req.body.name, fecha: req.body.birthdate, nacionalidad: req.body.nationality, equipo: req.body.teamID, posicion: req.body.position, dorsal: req.body.number, liga: req.body.leagueID, accion: "add", metodo: "POST" }})
    } else {
      
      db.players.insert({id: parseInt(req.body.playerid), name: req.body.name, birthdate: req.body.birthdate, nationality: req.body.nationality, teamID: parseInt(req.body.teamID), position: req.body.position, number: parseInt(req.body.number), leagueID: parseInt(req.body.leagueID) }, (err, docs) => {
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

// get player ID
router.get('/:id', async (req, res, next) => {
  let _playerID = parseInt(req.params.id);
  db.players.find({ id: _playerID }, (err, docs) => {
    if (err) {
      console.log(err)
    } else {
      //res.send(JSON.parse(docs));
      res.send(JSON.stringify(docs));
    }
  })
});

module.exports = router;
