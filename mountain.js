let noiseScale = 0.007;
let nPoint = 2000;
let points = [];

function setup(){
  createCanvas(1000,1000,WEBGL);
  background(0);
  for(let i = 0; i < nPoint; ++i){
    let x = random(width)
    let y = random(height)
    let point = [x,y];
    point.push(altitude(point, noiseScale,200));
    points.push(point);
  }
  /*
  for (let x = 0; x < width; ++x){
    for(let y = 0; y < height; ++y){
      let noiseVal = noise(x*noiseScale, y*noiseScale);
      stroke(noiseVal*255);
      ellipse(x, y, 10);
    }
  }*/

}

function draw() {
  background(0);
  orbitControl();
  rotateX(PI/3);
  rotateZ(millis()/4000);
  rotateY(-PI/12);
  for(let point of points){
    push();
    let x = point[0];
    let y = point[1];
    let z = point[2];
    stroke(0);
    fill(map(z,0,200,255,0),map(z,0,200,0,255),0);
    translate(x-width/2,y-height/2,z-200);
    box(10,10,10);
    pop();
  }
}


function altitude(point, noiseScale, mountainHeight){
  return map(noise(point[0]*noiseScale, point[1]*noiseScale),0,1,0,mountainHeight);
}
