

// ejercicio 9.1
let initState = function(what, solutionId) { 

    let item = localStorage.getItem(what);
    let respuesta = [];
    let varJson;
    
    // si no existe el item en el localStorage, se crea una variable con formato JSON y luego se convierte en un objeto JSON
    // si existe el item en el localStorage, se convierte el string en un objeto JSON
 
    
    if (item == null) {
        // console.log("no existe el item en el localStorage");
        item = { "guesses" : [], "solution": solutionId}; 
        localStorage.setItem(what, JSON.stringify(item));
        respuesta.push(item); 
    } else {
        varJson = JSON.parse(item); 
        respuesta.push(varJson); 
    }
    
    respuesta.push(function(guess) {
        let item = localStorage.getItem(what);
        item = JSON.parse(item);
        item.guesses.push(guess);
        localStorage.setItem(what, JSON.stringify(item));
    });

    
    return respuesta;
}

/**
 * Function to get the success rate
 * @param {*} e the json containing the stats rounded to 2 decimals
 * @returns success rate
 */
function successRate (e){
    let successRate = Math.round(((e.totalGames - e.gamesFailed) / e.totalGames) * 100);
    return successRate;
}

/**
 * Function to get the stats
 * @param {*} what the key of the item to get
 * @returns the json object of the gameStats
 */
let getStats = function(what) {
    let item = localStorage.getItem(what);

    if (item == null) {
        item = { "winDistribution" : [0,0,0,0,0,0,0,0,0], "gamesFailed": 0, "currentStreak": 0, "bestStreak": 0, "totalGames": 0, "successRate": 0}; 
        localStorage.setItem(what, JSON.stringify(item));
    } else {
        item = JSON.parse(item); 
    }

    return item;
};

/**
 * function to update the stats
 * @param {*} t the try in wich it was guessed, >=8 if it was not guessed
 */
function updateStats(t){
    let stats = getStats("gameStats");
    stats.totalGames++;
    if (t >= 8) {
        stats.gamesFailed++;
        stats.currentStreak = 0;
    } else {
        stats.winDistribution[t]++;
        stats.currentStreak++;
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }
    }
    stats.successRate = successRate(stats);
    localStorage.setItem("gameStats", JSON.stringify(stats));

};

export {updateStats, getStats, initState}