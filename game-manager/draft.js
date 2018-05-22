function setup() {

    // Create DB and fill it with records
    var teams = TAFFY();
  
    for(let i=0; i<4; i++){
      let city = floor(random(cities.length));
      let name = floor(random(names.length));
      //console.log(cities[city] + " " + names[name]);
      // teams.push(new Team(cities[city], names[name]));
      teams.insert({city: city, name: name});
      cities.splice(city, 1);
      names.splice(name, 1);
    }
  
    // teams.push(new Team("Really Good", "Team"));
    // teams.push(new Team("Really Bad", "Team"));

    console.table(teams, ["city", "name", "po", "ro", "pd", "rd", "st", "overall"]);
}
function draw(){
    alert(teams({name:"Boston"}).count());
}