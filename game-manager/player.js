class Player {
  constructor (fname, lname, pos, age, draftYear, contractYear, contractLength, po, ro, pd, rd, st, preferredNumber){
    this.fname = fname;
    this.lname = lname;
    this.name = fname + " " + lname;
    this.pos = pos;
    this.preferredNumber = preferredNumber;
    this.age = age;
    this.draftYear = draftYear;
    this.contractYear = contractYear;
    this.contractLength = contractLength;
    this.po = po;
    this.ro = ro;
    this.pd = pd;
    this.rd = rd;
    this.st = st;

    if (!this.preferredNumber){
        this.preferredNumber = generatePreferredNumber(this.pos);
    }

    switch(this.pos){
      case 'QB':
        this.overall = ceil((po + ro*.1) / 1.1);
        break;
      case 'RB':
        this.overall = ceil((po*.1 + ro + st*.25) / 1.35);
        break;
      case 'WR':
        this.overall = ceil((po + ro*.1 + st*.15) / 1.25);
        break;
      case 'TE':
        this.overall = ceil((po + ro + st*.25) / 2.25);
        break;
      case 'OL':
        this.overall = ceil((po + ro) / 2);
        break;
      case 'DL':
        this.overall = ceil((pd + rd) / 2);
        break;
      case 'LB':
      case 'DB':
        this.overall = ceil((pd + rd + st*.25) / 2.25);
        break; 
      case 'K':
      case 'P':
        this.overall = ceil((po*.005 + ro*.005 + st) / 1.01);
        break;
    }
  }
}