var points;
function setup(){
  createCanvas(800,600);
  points = poissonDisk(width, height, 40);
}

function poissonDisk(mapWidth, mapHeight, minDistance ){
  let grid = [];
  let finalPoints = [];
  let activePoints = [];
  let k = 30;
  let dimensionSpace = 2;

  //STEP 0
  let cellWidth = minDistance / Math.sqrt(dimensionSpace);
  let columns = Math.floor(mapWidth / cellWidth);
  let rows = Math.floor(mapHeight / cellWidth);
  for(let i = 0; i < columns * rows; ++i){
    grid[i] = undefined;
  }

  //STEP 1
  let x = random(mapWidth);
  let y = random(mapHeight);
  let dart = [x,y];
  let dartCol = floor(x / cellWidth);
  let dartRow = floor(y / cellWidth);
  let dartIndex = dartCol + dartRow * columns;
  grid[dartIndex] = dart;
  activePoints.push(dart);
  finalPoints.push(dart);

  //STEP 2
  while(activePoints.length > 0){
    let index = floor(random(activePoints.length));
    let point = activePoints[index];
    let probeAccepted = false;
    for(let i = 0; i < k ; ++i ){
      let angle = random(TWO_PI);
      let magnitude = random(minDistance, 2 * minDistance);
      let probe = [point[0] + (cos(angle) * magnitude), point[1] + (sin(angle) * magnitude)];
      let probeCol = floor(probe[0] / cellWidth);
      let probeRow = floor(probe[1] / cellWidth);
      let probeIndex = probeCol + (probeRow * columns);
      if(!inRange(probe, grid, cellWidth, columns, rows, minDistance)){
        grid[probeIndex] = probe;
        activePoints.push(probe);
        finalPoints.push(probe);
        probeAccepted = true;
        break;
      }
    }

    if(!probeAccepted){
      activePoints.splice(index, 1);
    }
  }
  return finalPoints;
}

function draw(){
  //draw grid
  background(0);
  strokeWeight(1);
  fill(255,0,0);
  line(400,400,400+40,400)
  for(let point of points){
    if(point){
      stroke(0,255,0);
      ellipse(point[0], point[1], 3);
    }
  }
}

function inRange(point, grid, cellWidth, columns, rows, r){
  let pointCol = floor(point[0] / cellWidth);
  let pointRow = floor(point[1] / cellWidth);
  if(pointCol >= 0 && pointRow >= 0 && pointCol <= columns && pointRow <= rows && !grid[pointCol + pointRow * columns]){
    for(let i=-2; i<=2; ++i){
      for(let j=-2; j<=2; ++j){
        let neighborIndex = (pointCol + i) + ((pointRow + j) * columns);
        let neighbor = grid[neighborIndex];
        if(neighbor && neighbor != point){
          if(dist(point[0], point[1], neighbor[0], neighbor[1]) < r){
            return true;
          }
        }
      }
    }
  }else{
    return true;
  }

  return false;
}
