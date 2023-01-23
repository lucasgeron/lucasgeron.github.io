let circles = [];
let speed = 0.0001;

let transition = true;
let bg = 255;

function hideDiv(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
    document.getElementById("logo").style.display = 'flex';
  }
}
function showDialog() {
  document.getElementById("main").style.display = "flex";
  document.getElementById("logo").style.display = 'none';
}
function keyPressed(){ 
  if (keyCode == 32) {
    
    document.getElementById("maxSize").value = random(10,1000);
    document.getElementById("maxSizeValue").innerHTML = document.getElementById("maxSize").value;
    
    document.getElementById("bubbles").value = random(1000);
    document.getElementById("curBubbles").innerHTML = document.getElementById("bubbles").value;

    document.getElementById("speed").value = random(-10, 10);
    setSpeed(document.getElementById("speed").value);
    document.getElementById("speedValue").innerHTML = document.getElementById("speed").value/10000;

    setup();
  }
}

class Bubble {
  constructor() {
    
    this.x = random(-width/2,width/2);
    this.y = random(-height / 2, height / 2);
    
    var maxSize = parseInt(document.getElementById("maxSize").value);
    document.getElementById("maxSizeValue").innerHTML = maxSize;

    this.r = 1;
    
    this.size = random(maxSize);
    this.expand = true;
    
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  createBubble() {
    noStroke();
    fill(this.color);
    circle(this.x,this.y,this.r);
  }


  moveBubble() {

    rotate(frameCount * speed);



    if (this.r > this.size) { 
      this.expand = false;
    } else if (this.r < 0) {
      this.expand = true;
    }

    if (this.expand) {
      this.r++;
    } else { 
      this.r--;
    }
    
    var opacity = document.getElementById("opacity").checked;
   

    if (opacity == true) {
    
      this.color.setAlpha(map(this.r, 0, this.size, 0, 100) / 100);
      fill(this.color);
    } 

  }

}

function setSpeed(value) {
  speed = value/10000;
  document.getElementById("speedValue").innerHTML = speed;
}

function setup() {
    
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 256, 100, 100);

  circles = [];
  
  bubbles = parseInt(document.getElementById("bubbles").value);
  document.getElementById("curBubbles").innerHTML = bubbles;

  for(let i = 0;i<bubbles;i++){
    circles.push(new Bubble());
  }

}

function changeBackground() {
  
  if (bg == 255) {
    bg = 0;
  }else {
    bg = 255;
  }

}
  
function draw() {

  translate(width / 2, height / 2);


  background(bg);
  
  for(let i = 0;i<circles.length;i++) {
    circles[i].createBubble();
    circles[i].moveBubble();
  }
  
}


