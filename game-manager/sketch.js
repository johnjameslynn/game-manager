var aPO, aRO, aPD, aRD, aST;
var bPO, bRO, bPD, bRD, bST;
var winner;
var positions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"];
var teams = [];
var conferences = [];
var divisions = [];
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

  conferences.push(new Conference('American League', 'american-league'));
  conferences.push(new Conference('National League', 'national-league'));

  divisions.push(new Division('North', 'north'));
  divisions.push(new Division('South', 'south'));
  divisions.push(new Division('East', 'east'));
  divisions.push(new Division('West', 'west'));

  var teamListing = document.getElementById('team-listing');

  let conferenceFragment = document.createDocumentFragment();

  for(let i=0; i<conferences.length; i++){

    let conferenceName = document.createElement('h3');
    conferenceName.innerHTML = conferences[i].name;
    conferenceName.classList.add('conference-' + conferences[i].slug);

    let conferenceEl = document.createElement('div');
    conferenceEl.classList.add('conference');
    conferenceEl.classList.add('conference-' + conferences[i].slug);

    conferenceFragment.appendChild(conferenceName);
    conferenceFragment.appendChild(conferenceEl);

    let divisionEl;
    let divisionFragment = document.createDocumentFragment();

    for(let j=0; j<divisions.length; j++){

      let divisionName = document.createElement('h4');
      divisionName.innerHTML = divisions[j].name;

      let divisionEl = document.createElement('div');
      divisionEl.classList.add('division');
      divisionEl.classList.add('division-' + divisions[j].slug);
      divisionEl.classList.add('division-' + conferences[i].slug);
      divisionEl.appendChild(divisionName);

      divisionFragment.appendChild(divisionEl);

      let teamList = document.createElement('ul');
      divisionEl.appendChild(teamList);

      let teamEl;
      let teamFragment = document.createDocumentFragment();

      let ranks = [1, 2, 3, 4];

      for(let k=0; k<4; k++){
        let city = floor(random(cities.length));
        let name = floor(random(names.length));
        let teamColor = floor(random(colors.length));
        let team = new Team(cities[city], names[name], colors[teamColor], j, i);

        let teamRank = floor(random(ranks.length));
        team.rank.push(teamRank);

        let teamIcon = document.createElement('div');
        teamIcon.classList.add('team-icon');
        teamIcon.style.borderTopColor = color(team.color["primary"][0], team.color["primary"][1], team.color["primary"][2]);
        teamIcon.style.borderBottomColor = color(team.color["secondary"][0], team.color["secondary"][1], team.color["secondary"][2]);

        teams.push(team);
        cities.splice(city, 1);
        names.splice(name, 1);
        colors.splice(teamColor, 1);
        ranks.splice(teamRank, 1);

        teamEl = document.createElement('li');
        teamEl.appendChild(teamIcon);
        teamEl.appendChild(document.createTextNode(team.city + ' ' + team.name));

        teamFragment.appendChild(teamEl);
        teamList.appendChild(teamFragment);
        divisionEl.appendChild(teamList);

      }

      divisionFragment.appendChild(teamFragment);
      conferenceEl.appendChild(divisionFragment);

    }

    conferenceFragment.appendChild(divisionFragment);

  }

  teamListing.appendChild(conferenceFragment);

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

  // console.table(teams, ["city", "name", "conference", "division", "po", "ro", "pd", "rd", "st", "overall"]);

  // button = createButton('Start Game');
  // button.position(0, 65);
  // button.mousePressed(startGame);

  field = new Field(1, color(0, 75, 0));
  schedule = new Schedule(teams, divisions, conferences);

  schedule.generateSchedule();

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