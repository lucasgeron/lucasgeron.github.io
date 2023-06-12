let vibrations = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    vibrations.push(new Particle(random(width), 0 ));
  }

}

function draw() {
  background(70);
  translate(width/2, height/2);
  

  for (let i = 0; i < vibrations.length; i++) {
    vibrations[i].show();
    vibrations[i].update();
  }
}


class Particle {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.history = [];
  }

  update() {
    this.y++;

    let v = createVector(this.x, this.y);

    this.history.push(v);

    if (this.history.length > 100) {
      this.history.splice(0, 1);
    }
  }

  show() {
    stroke(255);
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];

      strokeWeight(24)
      
      
      vertex(pos.x, pos.y);
      endShape();
    }

    noStroke();
    fill(255);
    ellipse(this.x, this.y, 24, 24);
  }
}

