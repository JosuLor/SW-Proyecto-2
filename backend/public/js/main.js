import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows } from './rows.js';
import { autocomplete } from "./autocomplete.js";

export { game }

// ejercicio 6.1
function differenceInDays(date1) {
  let difference = new Date().getTime() - date1.getTime();
  let days = Math.floor(difference / (1000 * 3600 * 24));
  return days + 1; //ese +1 es para que cuente el dia actual
}

let difference_In_Days = differenceInDays(new Date("08-18-2022"));

window.onload = function () {
  document.getElementById("gamenumber").innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
  
  let stats = localStorage.getItem("gameStats");

  if (stats == null) {
    stats = {winDistribution: [0,0,0,0,0,0,0,0,0],
      gamesFailed: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalGames: 0,
      successRate: 0
      }
    localStorage.setItem("gameStats", JSON.stringify(stats));
  }


};

// array central
//se le añade esa linea al guesses para que al recargar la página tenga en cuenta los intentos que ya has hecho previamente y los escriba en el comboBox
let game = {
  guesses: localStorage.getItem("WAYgameState") ? JSON.parse(localStorage.getItem("WAYgameState")).guesses : [],
  solution: {},
  players: [],
  leagues: [],
};


// ejercicio 6.3
function getSolution(players, solutionArray, difference_In_Days) {
  let sol = solutionArray[(difference_In_Days%solutionArray.length) - 1];
  let player = players.find((p) => p.id == sol.id);
  return player;
}

Promise.all([fetchJSON("fullplayers.json"), fetchJSON("solution.json")]).then(
  (values) => {
    let solution;
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);

    // console.log(game.solution);

    document.getElementById(
      "mistery"
    ).src = `https://playfootball.games/media/players/${
      game.solution.id % 32
    }/${game.solution.id}.png`;

    autocomplete(document.getElementById("myInput"), game) //




    //Ejercicio 7.6
    //esto en la milestone 2 estaba fuera de la funcion, por eso daba un error.......
  let inputelem = document.getElementById("myInput"); 
  inputelem.addEventListener("keydown", (tecla)=>{
    if(tecla.key == "Enter"){  
      let addRow = setupRows(game);
      addRow(inputelem.value);
    }
  });

  }
);


