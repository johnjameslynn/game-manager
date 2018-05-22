class Field {
  constructor (scale, endzoneColor){
    this.width = 160;
    this.length = 360;
    this.ezWidth = 30;
    this.scale = scale;
    this.endzoneColor = endzoneColor;
  }
  draw(){
    fill(36,117,21);
    rect(0, 0, this.length*this.scale, this.width*this.scale);
    noStroke();
    fill(this.endzoneColor);
    rect(0, 0, 30*this.scale, this.width*this.scale);
    rect(this.length*this.scale-30, 0, 30*this.scale, this.width*this.scale);
    fill(255);
    noStroke();
    for(let i=0; i<11; i++){
        rect(
            ((i*this.ezWidth)*this.scale)+(this.ezWidth*this.scale),
            0,
            2*this.scale,
            this.width*this.scale);
    }
  }
}