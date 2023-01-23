let y = 0;
let x = 0;
let spans = [];

let min = 50;
let max = 250;


let diameter = 20;
let grow = true;



function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  colorMode(HSB, 360, 100, 100);
  ellipseMode(RADIUS);
  noStroke();
  loop();
}


function draw() {


  clear();

  drawSpans(spans);

  // y++; // percorre o eixo Y
  // x++;

  x = random(0, width);
  y = random(0, height);
  
  if (y > height) { // verifica se passou do limite do canva
    y = 0; // reseta a linha no eixo 0
  }

  if (x > width) {
    x = 0; 
  }

  // desenha a linha a cada execuação do draw.
  // line(0, y, width, y); 
  // line(x, 0, x, height); 

    
  spans.push([x, y, random(parseInt(document.getElementById("minSize").value),parseInt(document.getElementById("maxSize").value)), [random(0, 255), random(0, 255), random(0, 255)]]);


  // console.log("circles: " + spans.length);
  document.getElementById("counter").innerHTML = spans.length.toLocaleString();

  var fr = document.getElementById("fr").value;
  
  // UPDATES
  frameRate(parseInt(fr));
  document.getElementById("fps").innerHTML = fr;

  min = document.getElementById("minSize").value;
  max = document.getElementById("maxSize").value;
 
}




function drawSpans(spans){ 
  if (spans.length > 0) {
    for (let i = 0; i < spans.length; i++) {
      fill(spans[i][3][0], spans[i][3][1], spans[i][3][2]);
      ellipse(spans[i][0], spans[i][1], spans[i][2], spans[i][2]);
    }
  }
}

function keyPressed(){ 
  if (keyCode == 32) {
    spans = [];
    console.log("clear")
  }
}

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