var aPO, aRO, aPD, aRD, aST;
var bPO, bRO, bPD, bRD, bST;
var winner;
var positions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"];
var teams = [];
var conferences = ['American League', 'National League'];
var divisions = ['North', 'South', 'East', 'West'];
var posNumberRange = {
  'QB' : [[1, 19]],
  'RB' : [[20, 49]],
  'WR' : [[10, 19], [80, 89]],
  'TE' : [[40, 49], [80, 89]],
  'OL' : [[60, 79]],
  'DL' : [[50, 59], [90, 99]],
  'LB' : [[40, 59], [90, 99]],
  'DB' : [[20, 49]],
  'K'  : [[1, 19]],
  'P'  : [[1, 19]],
};

// winPercentage = -(100/(1 + pow(10, -.07*(teamB.overall - teamA.overall))))+100;

function setup() {
  // var myCanvas = createCanvas(640,480);
  // myCanvas.parent('game');

  textSize(15);

  for(let i=0; i<conferences.length; i++){
    for(let j=0; j<divisions.length; j++){
      for(let k=0; k<4; k++){
        let city = floor(random(cities.length));
        let name = floor(random(names.length));
        let teamColor = color(random(255), random(255), random(255));
        //console.log(cities[city] + " " + names[name]);
        teams.push(new Team(cities[city], names[name], teamColor, j, i));
        cities.splice(city, 1);
        names.splice(name, 1);
      }  
    }
  }

  // teams.push(new Team("Really Good", "Team"));
  // teams.push(new Team("Really Bad", "Team"));

  // // A really good team for testing

  // teams[2].po = 99;
  // teams[2].ro = 99;
  // teams[2].pd = 99;
  // teams[2].rd = 99;
  // teams[2].st = 99;

  // // A really bad team for testing

  // teams[3].po = 0;
  // teams[3].ro = 0;
  // teams[3].pd = 0;
  // teams[3].rd = 0;
  // teams[3].st = 0;

  console.table(teams, ["city", "name", "conference", "division", "po", "ro", "pd", "rd", "st", "overall"]);

  // button = createButton('Start Game');
  // button.position(0, 65);
  // button.mousePressed(startGame);

  field = new Field(1, color(0, 75, 0));

}

function startGame(){
  homeTeam = teams[0];
  awayTeam = teams[1];

  field.endzoneColor = homeTeam.teamColor;

  game = new FootballGame(homeTeam, awayTeam, field, "SUNNY");
  game.startGame();
}

function draw() {

  // background(200);
  // field.draw();

}

function generatePreferredNumber(pos){
  this.pos = pos;
  this.posNumberRange = {
      'QB' : [[1, 19]],
      'RB' : [[20, 49]],
      'WR' : [[10, 19], [80, 89]],
      'TE' : [[40, 49], [80, 89]],
      'OL' : [[60, 79]],
      'DL' : [[50, 59], [90, 99]],
      'LB' : [[40, 59], [90, 99]],
      'DB' : [[20, 49]],
      'K' : [[1, 19]],
      'P' : [[1, 19]],
    };
    let n = [];
    for (let range of this.posNumberRange[pos]){
        n.push(round(random(range[0], range[1])));
    }
    return(random(n));
    // console.log(this.pos + " - " + n + " - " + n.length);
}