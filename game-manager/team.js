class Team {

  constructor (city, name, color, division, conference) {

    this.city = city;
    this.name = name;
    this.color = color;
    this.division = division;
    this.conference = conference;

    this.po;
    this.ro;
    this.pd;
    this.rd;
    this.st;

    this.players = [];
    this.coach = new Coach(random(fname), random(lname), round(random(35,65)), 2018, 2018, 1, random(offenseStyles), random(defenseStyles), random(defenseFormations));

    this.generatePositionGroup('QB', 1, this.players);
    this.generatePositionGroup('RB', 2, this.players);
    this.generatePositionGroup('WR', 4, this.players);
    this.generatePositionGroup('TE', 2, this.players);
    this.generatePositionGroup('OL', 5, this.players);

    this.generatePositionGroup('DL', 5, this.players);
    this.generatePositionGroup('LB', 4, this.players);
    this.generatePositionGroup('DB', 6, this.players);

    this.generatePositionGroup('K', 1, this.players);
    this.generatePositionGroup('P', 1, this.players);

    this.generatePositionGroup('', 9, this.players);

   this.updateOverall();

  }

  generatePositionOverall(skill, sums, ratingCO){
    let skillSum = 0;
    let skillCount = 0;
    this.skill = skill;
    this.sums = sums;
    this.ratingCO = ratingCO;
    for(var pos of positions){
      skillSum += (this.sums[pos][this.skill]/
        this.sums[pos]['count'])*
        this.ratingCO[pos][this.skill];
      skillCount += this.ratingCO[pos][this.skill];
    }

    return ceil(skillSum/skillCount);

  }

  generatePositionGroup(pos, num, arr){

    this.pos = pos;
    this.players = arr;

    let statRange = {
      'QB' : {
        'poMin': 75, 'poMax': 99,
        'roMin': 50, 'roMax': 99,
        'pdMin': 0, 'pdMax': 0,
        'rdMin': 0, 'rdMax': 0,
        'stMin': 0, 'stMax': 0,
      },
      'RB' : {
        'poMin': 50, 'poMax': 99,
        'roMin': 75, 'roMax': 99,
        'pdMin': 0, 'pdMax': 0,
        'rdMin': 0, 'rdMax': 0,
        'stMin': 65, 'stMax': 99,
      },
      'WR' : {
        'poMin': 75, 'poMax': 99,
        'roMin': 5, 'roMax': 65,
        'pdMin': 0, 'pdMax': 0,
        'rdMin': 0, 'rdMax': 0,
        'stMin': 65, 'stMax': 99,
      },
      'TE' : {
        'poMin': 75, 'poMax': 99,
        'roMin': 75, 'roMax': 99,
        'pdMin': 0, 'pdMax': 0,
        'rdMin': 0, 'rdMax': 0,
        'stMin': 75, 'stMax': 99,
      },
      'OL' : {
        'poMin': 70, 'poMax': 99,
        'roMin': 70, 'roMax': 99,
        'pdMin': 0, 'pdMax': 0,
        'rdMin': 0, 'rdMax': 0,
        'stMin': 0, 'stMax': 0,
      },
      'DL' : {
        'poMin': 0, 'poMax': 0,
        'roMin': 0, 'roMax': 0,
        'pdMin': 70, 'pdMax': 99,
        'rdMin': 70, 'rdMax': 99,
        'stMin': 0, 'stMax': 0,
      },
      'LB' : {
        'poMin': 0, 'poMax': 0,
        'roMin': 0, 'roMax': 0,
        'pdMin': 70, 'pdMax': 99,
        'rdMin': 70, 'rdMax': 99,
        'stMin': 70, 'stMax': 99,
      },
      'DB' : {
        'poMin': 0, 'poMax': 0,
        'roMin': 0, 'roMax': 0,
        'pdMin': 70, 'pdMax': 99,
        'rdMin': 70, 'rdMax': 99,
        'stMin': 70, 'stMax': 99,
      },
      'K' : {
        'poMin': 0, 'poMax': 25,
        'roMin': 0, 'roMax': 10,
        'pdMin': 0, 'pdMax': 0,
        'rdMin': 0, 'rdMax': 0,
        'stMin': 70, 'stMax': 99,
      },
      'P' : {
        'poMin': 0, 'poMax': 25,
        'roMin': 0, 'roMax': 10,
        'pdMin': 0, 'pdMax': 0,
        'rdMin': 0, 'rdMax': 0,
        'stMin': 70, 'stMax': 99,
      }
    };

      for (var i = 0; i < num; i++){
        if (this.pos == ''){
          this.pos = random(positions);
        }

        let age = floor(random(22,31));
        let drafted = 2018-(age-22);
        let contractYear = floor(random(drafted, 2018));
        let contractLength = ceil(random(2018-contractYear, 6));

        this.newPlayer = new Player(
          random(fname),
          random(lname),
          this.pos, age, drafted, contractYear, contractLength,
          ceil(random(statRange[this.pos]['poMin'], statRange[this.pos]['poMax'])),
          ceil(random(statRange[this.pos]['roMin'], statRange[this.pos]['roMax'])),
          ceil(random(statRange[this.pos]['pdMin'], statRange[this.pos]['pdMax'])),
          ceil(random(statRange[this.pos]['rdMin'], statRange[this.pos]['rdMax'])),
          ceil(random(statRange[this.pos]['stMin'], statRange[this.pos]['stMax']))
        );
        this.players.push(this.newPlayer);
        this.pos = pos;
      }
  }

  updateOverall(){

    let sums = {}, counts = {}, results = {}, pos;
    for (var i = 0; i < this.players.length; i++) {
        pos = this.players[i].pos;
        if (!(pos in sums)) {
          sums[pos] = { po: 0, ro: 0, pd: 0, rd: 0, st: 0, count: 0};
          counts[pos] = 0;
        }
        sums[pos]['po'] += this.players[i].po;
        sums[pos]['ro'] += this.players[i].ro;
        sums[pos]['pd'] += this.players[i].pd;
        sums[pos]['rd'] += this.players[i].rd;
        sums[pos]['st'] += this.players[i].st;
        sums[pos]['count'] ++;
        counts[pos]++;
    }

    // console.table(this.players, ['name', 'pos', 'age', 'po', 'ro', 'pd', 'rd', 'st', 'overall']);

    this.ratingCO = {
      'QB' : { 'po' : 1,  'ro' : .1,  'pd' : 0, 'rd' : 0, 'st' : 0 },
      'RB' : { 'po' : .2, 'ro' : 1,   'pd' : 0, 'rd' : 0, 'st' : .1 },
      'WR' : { 'po' : .4, 'ro' : .1, 'pd' : 0, 'rd' : 0, 'st' : .1 },
      'TE' : { 'po' : .4, 'ro' : .5, 'pd' : 0, 'rd' : 0, 'st' : .1 },
      'OL' : { 'po' : .4, 'ro' : .5, 'pd' : 0, 'rd' : 0, 'st' : 0 },
      'DL' : { 'po' : 0, 'ro' : 0, 'pd' : 1, 'rd' : 1, 'st' : 0 },
      'LB' : { 'po' : 0, 'ro' : 0, 'pd' : 1, 'rd' : 1, 'st' : .1 },
      'DB' : { 'po' : 0, 'ro' : 0, 'pd' : 1, 'rd' : 1, 'st' : .1 },
      'K'  : { 'po' : 0, 'ro' : 0, 'pd' : 0, 'rd' : 0, 'st' : 1 },
      'P'  : { 'po' : 0, 'ro' : 0, 'pd' : 0, 'rd' : 0, 'st' : 1 },
    };

    this.po = this.generatePositionOverall('po', sums, this.ratingCO);
    this.ro = this.generatePositionOverall('ro', sums, this.ratingCO);
    this.pd = this.generatePositionOverall('pd', sums, this.ratingCO);
    this.rd = this.generatePositionOverall('rd', sums, this.ratingCO);
    this.st = this.generatePositionOverall('st', sums, this.ratingCO);

    this.overall = ceil((this.po + this.ro + this.pd + this.rd + this.st*.5) / 4.5);
  }
}