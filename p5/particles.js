const Y_AXIS = 1;
const X_AXIS = 2;
let c1, c2;
let cnt = 0;


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
    
    // c1 = color(random(100,255),random(100,255),random(100,255));
    // c2 = color(random(100, 255), random(100, 255), random(100, 255));
    
    document.getElementById("minXs").value = random(-50,50);
    document.getElementById("maxXs").value = random(-50,50);
    document.getElementById("minYs").value = random(-50,50);
    document.getElementById("maxYs").value = random(-50,50);
  
    document.getElementById("cntRadius").value = random(0,250);
    document.getElementById("cntOpacity").value = random(0, 100);
    document.getElementById("particles").value = random(0, 150);
    setup();
  }
}


// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
    constructor(){
      this.x = random(0,width);
      this.y = random(0,height);
      this.r = random(1, 15);
      
      var minXs = parseInt(document.getElementById("minXs").value);
      var maxXs = parseInt(document.getElementById("maxXs").value);
      var minYs = parseInt(document.getElementById("minYs").value);
      var maxYs = parseInt(document.getElementById("maxYs").value);

      document.getElementById("minXsValue").innerHTML = minXs;
      document.getElementById("maxXsValue").innerHTML = maxXs;
      document.getElementById("minYsValue").innerHTML = minYs;
      document.getElementById("maxYsValue").innerHTML = maxYs;
    
      this.xSpeed = random(minXs,maxXs);
      this.ySpeed = random(minYs,maxYs);
    }
  
  // creation of a particle.
    createParticle() {
      noStroke();
      fill('rgba(255,255,255,1)');
      circle(this.x,this.y,this.r);
    }
  
  // setting the particle in motion.
    moveParticle() {
      if(this.x < 0 || this.x > width)
        this.xSpeed*=-1;
      if(this.y < 0 || this.y > height)
        this.ySpeed*=-1;
      this.x+=this.xSpeed;
      this.y+=this.ySpeed;
    }
  
  // this function creates the connections(lines)
  // between particles which are less than a certain distance apart
    joinParticles(particles) {
    var cntRadius = parseInt(document.getElementById("cntRadius").value);
    var cntOpacity = parseInt(document.getElementById("cntOpacity").value);

    document.getElementById("cntOpacityValue").innerHTML = cntOpacity;
    document.getElementById("cntRadiusValue").innerHTML = cntRadius;
    
      particles.forEach(element =>{
        let dis = dist(this.x,this.y,element.x,element.y);
        if(dis<cntRadius) {
          stroke('rgba(255,255,255,'+cntOpacity/100+')');
          line(this.x, this.y, element.x, element.y);
          cnt++;
        }
      });
      

      if (cntRadius != 0) {
        document.getElementById("counter").innerHTML = (cnt - parseInt(document.getElementById('particles').value)).toLocaleString();
        document.getElementById("counter-range").value = cnt - parseInt(document.getElementById('particles').value);
      } else {
        document.getElementById("counter").innerHTML = 0;
        document.getElementById("counter-range").value = 0;
      }
    }
  
  }
  
  // an array to add multiple particles
  let particles = [];
  
function setup() {
    
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 256, 100, 100);

    clear();
    particles = [];

    // Define colors
    c1 = color(random(100,255),random(100,255),random(100,255));
    c2 = color(random(100,255),random(100,255),random(100,255));

    maxParticles = parseInt(document.getElementById('particles').value);
    document.getElementById("curParticles").innerHTML = document.getElementById("particles").value ;
   
    for(let i = 0;i<maxParticles;i++){
      particles.push(new Particle());
    }

  }
  
  function draw() {
    
     // Background
    setGradient(0, 0, width, height, c1, c2, X_AXIS);
    setGradient(width, 0, width, height, c2, c1, X_AXIS);

    for(let i = 0;i<particles.length;i++) {
      particles[i].createParticle();
      particles[i].moveParticle();
      particles[i].joinParticles(particles.slice(i));
    }
      cnt = 0;
  }
  


  function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();
  
    if (axis === Y_AXIS) {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
      }
    } else if (axis === X_AXIS) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        let inter = map(i, x, x + w, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(i, y, i, y + h);
      }
    }
  }


  function resetX() {
    document.getElementById("minXs").value = -25;
    document.getElementById("maxXs").value = 25;
    setup();
  }

  function resetY() {
    document.getElementById("minYs").value = -5;
    document.getElementById("maxYs").value = 5;
    setup();
  }

  function stopX() {
    document.getElementById("minXs").value = 0;
    document.getElementById("maxXs").value = 0;
    setup();
  }

  function stopY() {
    document.getElementById("minYs").value = 0;
    document.getElementById("maxYs").value = 0;
    setup();
  }