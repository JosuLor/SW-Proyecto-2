import { fetchJSON } from "./loaders.js";
import { higher, toggle, headless,stats} from "./fragments.js";
import { lower } from "./fragments.js";
import { updateStats, getStats, initState} from "./stats.js";

//import {autocomplete} from "./autocomplete.js";
// YOUR CODE HERE :
// .... stringToHTML ....
// .... setupRows .....
// .... initState ....
//

// From: https://stackoverflow.com/a/7254108/243532
function pad(a, b) {
    return (1e15 + a + "").slice(-b);
}

// YOUR CODE HERE :
import { stringToHTML } from "./fragments.js"; // .... stringToHTML ....
export { setupRows }; // .... setupRows .....

const delay = 350;
const attribs = ["nationality", "leagueId", "teamId", "position", "birthdate"];

let setupRows = function (game) {
    // ejercicio 9.2.1
    let [state, updateState] = initState("WAYgameState", game.solution.id); // si se comenta esto, el combobox aparece

    //initialize the previous guesses and check if the game is over
    async function start(list){
        let content
        let guess
        let playerId
        game.guesses = list;
        for (let i = 0; i < list.length ; i++) {
            playerId = list[i];
            guess = await getPlayer(playerId)
            content = setContent(guess)
            showContent(content, guess)
            if(guess.id == game.solution.id){
                success();
            }
        }
        if(list.length >= 7){
            gameOver();
        }
        showContent(content, guess)

    } 
    
    // Ejercicio 7.4
    /**
     * gives the id of the flag depending on the id of the league
     * @param leagueId the id of that league
     * @return the identifier of the flag
     */
    function leagueToFlag(leagueId) {
        //FALTA COMPROBAR
        let jsonAux = {
            league_flags: [
                {
                    leagueId: "564",
                    flagId: "es1",
                },
                {
                    leagueId: "8",
                    flagId: "en1",
                },
                {
                    leagueId: "82",
                    flagId: "de1",
                },
                {
                    leagueId: "384",
                    flagId: "it1",
                },
                {
                    leagueId: "301",
                    flagId: "fr1",
                },
            ],
        };

        let i = 0;
        while (
            i < jsonAux.league_flags.length &&
            leagueId != jsonAux.league_flags[i].leagueId
        ) {
            i++;
        }

        return jsonAux.league_flags[i].flagId;
    }

    // Ejercicio 7.1
    /**
     * Gets the age of one player 
     * @param {*} dateString the date of birth of a player in Year-Month-Day format
     * @return the age of one player
     */
    function getAge(dateString) {
        //dateString es la fecha del nacimiento de un jugador en formato Año-Mes-Dia

        let arrayFechNacimiento = dateString.split("-");
        let actualDate = new Date(); //Fecha actual

        let edad = actualDate.getUTCFullYear() - arrayFechNacimiento[0] - 1;

        // console.log("Dia actual: " + actualDate.getUTCDate());
        // console.log("Dia Nacimiento: " + arrayFechNacimiento[2]);
        // console.log("-----------------------------------------------");
        // console.log("Mes actual: " + (actualDate.getUTCMonth()+1));
        // console.log("Mes Nacimiento: " + arrayFechNacimiento[1]);
        if (
            arrayFechNacimiento[1] < actualDate.getUTCMonth() + 1 ||
            (arrayFechNacimiento[1] == actualDate.getUTCMonth() + 1 &&
                arrayFechNacimiento[2] <= actualDate.getUTCDate())
        ) {
            //arrayFechNacimiento[1] = mes de nacimiento
            edad++;
        }
        return (edad);
    }
    // Para probar geAge(Date) : getAge("1999-01-14");

    //Ejercicio 7.2
    /**
     * Checks if player given is the correct one
     * @param {String} theKey the correct player
     * @param {String} theValue the player given
     */
    let check = function (theKey, theValue) {
        if (game.solution[theKey] == theValue) {
            return "correct";
        }
        return "incorrect";
    };

    function unblur(outcome) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                document
                    .getElementById("mistery")
                    .classList.remove("hue-rotate-180", "blur");
                document.getElementById("combobox").remove();
                let color, text;
                if (outcome == "success") {
                    color = "bg-blue-500";
                    text = "Awesome";
                } else {
                    color = "bg-rose-500";
                    text = "The player was " + game.solution.name;
                }
                document.getElementById(
                    "picbox"
                ).innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`;
                resolve();
            }, "2000");
        });
    }

    // console.log(check('nationality', 'Spain'));
    function showStats(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout);
        });
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild);
            document
                .getElementById("mistery")
                .classList.remove("hue-rotate-180", "blur");
        };
    }

    function setContent(guess) {
        return [
            `<img src="https://playfootball.games/who-are-ya/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(
                guess.leagueId
            )}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${
                guess.teamId % 32
            }/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)}` /* YOUR CODE HERE */,
        ];
    }

    function showContent(content, guess) {
        let fragments = "",
            s = "";
        for (let j = 0; j < content.length-1; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms");
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${
                                check(attribs[j], guess[attribs[j]]) ==
                                "correct"
                                    ? "bg-green-500"
                                    : ""
                            } opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`;
        }
        //Add the las element with the corresponding arrow if the age is lower or higher than the correct one
            
            let difference 
            if (game.solution[attribs[content.length-1]]  < guess[attribs[content.length-1]]) {
                
                difference = higher
                
            }else if(game.solution[attribs[content.length-1]] > guess[attribs[content.length-1]]){
                
                difference = lower
                
            }else{
                    difference = ""

            }

            s = "".concat(((content.length-1 + 1) * delay).toString(), "ms");
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${
                                check(attribs[content.length-1], guess[attribs[content.length-1]]) ==
                                "correct"
                                    ? "bg-green-500"
                                    : ""
                            } opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">

                                  ${content[content.length-1]}${difference}
                            </div>
                         </div>`;
        ///////////////////////

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`;

        let playersNode = document.getElementById("players");
        playersNode.prepend(stringToHTML(child));
    }

    // ejercicio 9.3
    function resetInput() {
        document.getElementById("myInput").value = "Guess " + (game.guesses.length+1) + " of 8";
    }


    // Ejercicio 7.3
    /**
     * function to get the player with that id
     * @param {*} playerId the id of the player to find
     * @returns the player object if found, null otherwise
     */
    let getPlayer = async function (playerId) {
        //FALTA COMPROBAR
        let jugadores = await fetchJSON("../json/fullplayers.json").then((data) => {
            // console.log(data);
            return data;
        })
        
        let player = jugadores.find((jugador) => jugador.id == playerId);

        if (player) {
            // console.log("sol",player)
            // console.log(player.number)
            return player
        }
        // console.log(`No existe el jugador con el id ${playerId}`);
        return null;
    };

    // ejercicio 9.4
    function gameEnded(lastGuess) {
        if (game.guesses.length < 8) {
            if (lastGuess == game.solution.id) {
                return true;
            } else {
                return false;
            }
        }

        return true;
    }
    resetInput();
    
    function success() {
        showStats();
        unblur("success");
        // console.log("sucess function");
    }

    function gameOver() {
        showStats();
        unblur("gameOver");
        // console.log("gameOver function");
    }
    start(state.guesses)
    return /* addRow */ async function (playerId) {
        //ESTO ES LO QUE HACE "SetUpRows" EN "main.js"

        // ejercicio 9.5 / 9.6
        // hay que añadir cosas, no se a que se refiere, porque literalmente no dice que hay que añadir
        // ademas, hay que hacer algo del unblur
        // hay que hacer gameOver() y sucess()

        // ejercicio 9.2.2
        let guess = await getPlayer(playerId)

        let content = setContent(guess)
        game.guesses.push(playerId)
        updateState(playerId)
        
        resetInput();

         if (gameEnded(playerId)) {
            updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                // console.log("OGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
                success();
            }
            if (game.guesses.length == 8) {
                gameOver();
            }
            
            //TODO - interval
            //get the time until the next day

            setInterval(() => {
                //get the actual time of the day
                let now = new Date();
                let hours = 23 - now.getHours();
                let minutes = 60 - now.getMinutes();
                let seconds = 60 - now.getSeconds();
                let time = document.getElementById("nextPlayer");
                time.innerHTML = hours +":" +minutes +":" + seconds;
            }, 1000);
            
        }
        showContent(content, guess)


        // ESTO NO APARECE EN LA MILESTONE 4, NO SE QUE QUERIAIS HACER CON
        // PA NO BORRAR NADA QUE NO HABIA QUE BORRAR, COPIO LO DE LA MILESTORE 4 Y DEJO ESTO COMO ESTA       
        //let guess = await getPlayer(playerId)

        //let content = setContent(guess)
        //showContent(content, guess)
        
        //let guess = getPlayer(playerId);
        //console.log(guess);

        // let content = setContent(guess);

        // game.guesses.push(playerId);
        // updateState(playerId);

        // resetInput();

        // if (gameEnded(playerId)) {
        //     // updateStats(game.guesses.length);

        //     if (playerId == game.solution.id) {
        //         success();
        //     }

        //     if (game.guesses.length == 8) {
        //         gameOver();
        //     }

        //     //TODO - interval
        //     let interval = /* YOUR CODE HERE */ 0;
        // }
        // showContent(content, guess);
    };
};
