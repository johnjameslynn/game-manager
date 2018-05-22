offenseStyles = [
    'Vertical',
    'West Coast',
    'Run Heavy',
    'Balanced',
    'Spread',
    'Run and Shoot'
];

defenseStyles = [
    'Man to Man',
    'Zone',
    'Tampa 2'
]
defenseFormations = [
    '4-3',
    '3-4'
];

class Coach {
    constructor (fname, lname, age, firstYear, contractYear, contractLength, offenseStyle, defenseStyle, defenseFormation){
      this.fname = fname;
      this.lname = lname;
      this.name = fname + " " + lname;
      this.age = age;
      this.firstYear = firstYear;
      this.contractYear = contractYear;
      this.contractLength = contractLength;
      this.offenseStyle = offenseStyle;
      this.defenseStyle = defenseStyle;
      this.defenseFormation = defenseFormation;
    }
  
    draw(){
      createElement('div', this.name);
    }
  
  }