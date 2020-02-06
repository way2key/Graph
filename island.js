var n = 100;
var minValue = 100;
var maxValue = 300;
var noiseWidth = 1;


var p;
var polygon = [];
function setup(){
  createCanvas(800,600);
  p = [400, 400];

  translate(width/2,height/2);
  fill(255,0,255,110);
  stroke(255);
  beginShape();
  for(let a=0; a<TWO_PI; a += TWO_PI/n){
    let xoff = map(cos(a),-1,1,0,noiseWidth);
    let yoff = map(sin(a),-1,1,0,noiseWidth);
    let r = map(noise(xoff,yoff),0,1,minValue,maxValue);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x,y);
    polygon.push([x+width/2,y+height/2]);
  }
  endShape();
}

function draw(){
  p=[mouseX,mouseY];
  if(isInsidePolygon(polygon,p)){
    fill(0,255,0);
  }else{
    fill(255,0,0);
  }
  ellipse(p[0],p[1],15);
}

function isInsideTriangle(triangle, point){
  let px = point[0];
  let py = point[1];
  let ax = triangle[0][0];
  let ay = triangle[0][1];
  let bx = triangle[1][0];
  let by = triangle[1][1];
  let cx = triangle[2][0];
  let cy = triangle[2][1];

  let w1 = (ax * (cy - ay) + (py - ay) * (cx - ax) - px * (cy - ay)) / ((by - ay) * (cx - ax) - (bx - ax) * (cy -ay));
  let w2 = (py - ay - w1 * (by - ay)) / (cy - ay) ;

  if ((w1 >= 0) && ((w1 + w2) < 1) && (w2 >= 0)){
    return true;
  }else{
    return false;
  }
}

function isInsidePolygon(polygon, point){
  let counter = 0;
  let p0x = polygon[0][0];
  let p0y = polygon[0][1];
  for(let i = 1; i < polygon.length; ++i){
    let t = [[p0x,p0y], [polygon[i-1][0],polygon[i-1][1]], [polygon[i][0],polygon[i][1]] ];

    if(isInsideTriangle(t, point)){
      ++counter;
    }
  }

  if(counter %2 == 0){
    return true;
  }else{
    return false;
  }
}
