// //Ejercicios 3

// //Ejercicios 3.1
// let data = fetch('http://api.football-data.org/v4/competitions') .then( r => r.json()) .then( data => { console.log(data) } );

// let id2014 = data.filter( d => d.ID == "2014")

// //Ejercicios 3.2
// let tier1 = id2014.filter( d => d.plan == "TIER_ONE").map( d => d.name)

// //Ejercicios 3.3
// let esp = data.filter( d => d.area.name == "Spain").map( d => d.name)

// //Ejercicios 3.4
// let tier1Full = data.filter( d => d.plan == "TIER_ONE").filter(d => d.code == ("ESP" || "DEU" || "ENG" || "FRA")).map( d => d.name)

// //Ejercicios 3.5
// let tier1Full = data.filter( d => d.plan == "TIER_ONE").filter(d => {d.code == ("ESP" || "DEU" || "ENG" || "FRA") && d.name != "Championship"}).map( d => d.name)

// //Ejercicios 3.6
// let tier1Full = data.filter( d => d.plan == "TIER_ONE").filter(d => {d.code == ("ESP" || "DEU" || "ENG" || "FRA") && d.name != "Championship"}).map( d => d.id)