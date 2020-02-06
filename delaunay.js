var points = [];
var delaunay;
var island;


function setup(){
  createCanvas(800,600);
  points = poissonDisk(width, height, 35);
  delaunay = Delaunator.from(points);

  // Island parameters: NumberOfPoints, minValue, maxValue, randomness
  island = island(120, 40, 500, 4);

  background(0);
  //Draw Circumcenter Points
  /*for(var i=0; i<delaunay.triangles.length/3; ++i){
    let center = triangleCenter(points,delaunay,i);
    fill(255);
    noStroke();
    ellipse(center[0],center[1],4);
    let barycenter = triangleBarycenter(points,delaunay,i);
    strokeWeight(2);
    stroke(0,255,0);
    line(center[0],center[1],barycenter[0],barycenter[1]);
  }*/

  //Draw Barycenter Points
  /*
  fill(12,10,240);
  stroke(12,10,255);
  strokeWeight(4);
  noStroke();
  for(let i=0; i<delaunay.triangles.length/3; ++i){
    let center = triangleBarycenter(points, delaunay,i);
    //ellipse(center[0],center[1],4);
  }*/

  //Draw delaunay Triangles
  /*
  for(let i=0; i<delaunay.triangles.length/3; ++i){
    let t = pointsOfTriangle(delaunay,i).map(e => points[e]);
    fill(255,random(255),random(255),20);
    stroke(0)
    strokeWeight(0);
    triangle(t[0][0], t[0][1], t[1][0], t[1][1], t[2][0], t[2][1]);
  }*/

  //Draw delaunay Lines
  /*
  stroke(255,0,0,30);
  strokeWeight(2);
  for(let i=0; i<delaunay.triangles.length; ++i){
    if(i>delaunay.halfedges[i]){
      let p1 = delaunay.triangles[i];
      let p2 = delaunay.triangles[nextHalfedge(i)];
      line(points[p1][0], points[p1][1], points[p2][0], points[p2][1]);
    }
  }*/

  //Draw delaunay Points
  /*
  fill(255,10,20,40);
  noStroke();
  strokeWeight(10);
  for(let point of points){
    ellipse(point[0],point[1],4);
  }*/

  //Draw Voronoi Lines
  stroke(0,0,255);
  strokeWeight(2);
  for (let i=0; i<delaunay.triangles.length; ++i) {
    if (i < delaunay.halfedges[i]) {
      //mix
      /*let triangle  = pointsOfTriangle(delaunay,triangleOfEdge(i)).map(e => points[e]);
      let triangle2 = pointsOfTriangle(delaunay,triangleOfEdge(delaunay.halfedges[i])).map(e => points[e]);

      let p1 = triangleCenter(points, delaunay, triangleOfEdge(i));
      if(!pointInTriangle(triangle,p1)){

        p1 = triangleBarycenter(points, delaunay, triangleOfEdge(i));
      }
      let p2 = triangleCenter(points, delaunay, triangleOfEdge(delaunay.halfedges[i]));
      if(!pointInTriangle(triangle2,p2)){
        p2 = triangleBarycenter(points, delaunay, triangleOfEdge(delaunay.halfedges[i]));
}*/

      //barycenter
      //let p1 = triangleBarycenter(points, delaunay, triangleOfEdge(i));
      //let p2 = triangleBarycenter(points, delaunay, triangleOfEdge(delaunay.halfedges[i]));

      //circumcenter
      let p1 = triangleCenter(points, delaunay, triangleOfEdge(i));
      let p2 = triangleCenter(points, delaunay, triangleOfEdge(delaunay.halfedges[i]));

      line(p1[0],p1[1],p2[0],p2[1]);
    }
  }

  //Draw Voronoi Cell
  const seen = new Set();  // of point ids
  for (let e = 0; e < delaunay.triangles.length; ++e) {
      const p = delaunay.triangles[nextHalfedge(e)];
      if (!seen.has(p)) {
          seen.add(p);
          const edges = edgesAroundPoint(delaunay, e);
          const triangles = edges.map(triangleOfEdge);
          const vertices = triangles.map(t => triangleCenter(points, delaunay, t));
          if(!pointInPolygon(island, vertices[0])){
            fill(255,random(100,255),0,175);
          }else{
            fill(0,random(100),255,100);
          }
          stroke(0);
          strokeWeight(0);
          beginShape();
          for(let j=0; j< vertices.length; ++j){
            vertex(vertices[j][0], vertices[j][1]);
          }
          endShape(CLOSE);
      }
  }
  //Draw Voronoi Cell 2
  /*const index = new Map();
  for (let e=0; e < delaunay.triangles.length; ++e) {
    const endpoint = delaunay.triangles[nextHalfedge(e)];
    if (!index.has(endpoint) || delaunay.halfedges[e] === -1){
      index.set(endpoint, e);
    }
  }
  stroke(0);
  strokeWeight(0);
  for(let p = 0; p < points.length; ++p) {
    const incoming = index.get(p);
    const edges = edgesAroundPoint(delaunay, incoming);
    const triangles = edges.map(triangleOfEdge);
    const vertices = triangles.map(t => triangleBarycenter(points, delaunay, t));
    fill(255,random(255),random(255),150);
    beginShape();
    for(let j=0; j< vertices.length; ++j){
      vertex(vertices[j][0], vertices[j][1]);
    }
    endShape();
  }*/



}

function draw(){
}

// Helpers

// General Delaunator
function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }
function triangleOfEdge(e)  { return Math.floor(e / 3); }
function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }
function prevHalfedge(e) { return (e % 3 === 0) ? e + 2 : e - 1; }

// Edges
function forEachTriangleEdge(points, delaunay, callback) {
    for (let e = 0; e < delaunay.triangles.length; e++) {
        if (e > delaunay.halfedges[e]) {
            const p = points[delaunay.triangles[e]];
            const q = points[delaunay.triangles[nextHalfedge(e)]];
            callback(e, p, q);
        }
    }
}

// Triangles
function pointsOfTriangle(delaunay, t) {
    return edgesOfTriangle(t)
        .map(e => delaunay.triangles[e]);
}
function forEachTriangle(points, delaunay, callback) {
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        callback(t, pointsOfTriangle(delaunay, t).map(p => points[p]));
    }
}
function trianglesAdjacentToTriangle(delaunay, t) {
    const adjacentTriangles = [];
    for (const e of edgesOfTriangle(t)) {
        const opposite = delaunay.halfedges[e];
        if (opposite >= 0) {
            adjacentTriangles.push(triangleOfEdge(opposite));
        }
    }
    return adjacentTriangles;
}

// Voronoi Polygon
function forEachVoronoiEdge(points, delaunay, callback) {
    for (let e = 0; e < delaunay.triangles.length; e++) {
        if (e < delaunay.halfedges[e]) {
            const p = triangleCenters(points, delaunay, triangleOfEdge(e));
            const q = triangleCenters(points, delaunay, triangleOfEdge(delaunay.halfedges[e]));
            callback(e, p, q);
        }
    }
}
function edgesAroundPoint(delaunay, start) {
    const result = [];
    let incoming = start;
    do {
        result.push(incoming);
        const outgoing = nextHalfedge(incoming);
        incoming = delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
}
function forEachVoronoiCell(points, delaunay, callback) {
    const seen = new Set();  // of point ids
    for (let e = 0; e < delaunay.triangles.length; e++) {
        const p = delaunay.triangles[nextHalfedge(e)];
        if (!seen.has(p)) {
            seen.add(p);
            const edges = edgesAroundPoint(delaunay, e);
            const triangles = edges.map(triangleOfEdge);
            const vertices = triangles.map(t => triangleCenter(points, delaunay, t));
            console.log(vertices);
            callback(p," ", vertices);
        }
    }
}

// Circumcenter
function circumcenter(a, b, c) {
    const ad = a[0] * a[0] + a[1] * a[1];
    const bd = b[0] * b[0] + b[1] * b[1];
    const cd = c[0] * c[0] + c[1] * c[1];
    const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
    return [
        1 / D * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
        1 / D * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
    ];
}
function triangleCenter(points, delaunay, t) {
    const vertices = pointsOfTriangle(delaunay, t).map(p => points[p]);
    return circumcenter(vertices[0], vertices[1], vertices[2]);
}

// Barycenter
function barycenter(a){
  var x = 0;
  var y = 0;
  for(let point of a){
    x += point[0];
    y += point[1];
  }
  x /= a.length;
  y /= a.length;
  return [x,y];
  }
function triangleBarycenter(points, delauney, t){
  const vertices = pointsOfTriangle(delaunay, t).map(p => points[p]);
  return barycenter(vertices);
}

// Point inside a triangle
function pointInTriangle(triangle, point){
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

// Point inside a polygon
function pointInPolygon(polygon, point){
  let counter = 0;
  let p0x = polygon[0][0];
  let p0y = polygon[0][1];
  for(let i = 1; i < polygon.length; ++i){
    let t = [[p0x,p0y], [polygon[i-1][0],polygon[i-1][1]], [polygon[i][0],polygon[i][1]] ];

    if(pointInTriangle(t, point)){
      ++counter;
    }
  }
  if(counter %2 == 0){
    return true;
  }else{
    return false;
  }
}

// PoissonDisk
function poissonDisk(mapWidth, mapHeight, minDistance ){
  let grid = [];
  let finalPoints = [];
  let activePoints = [];
  let k = 100;
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

// Island
function island(n, min, max, noiseWidth) {
  let polygon = [];
  for(let a=0; a<TWO_PI; a+=(TWO_PI/n)){
    let xoff = map(cos(a),-1,1,0,noiseWidth);
    let yoff = map(sin(a),-1,1,0,noiseWidth);
    let r = map(noise(xoff,yoff),0,1,min,max);
    let x = r * cos(a);
    let y = r * sin(a);
    polygon.push([x+width/2,y+height/2]);
  }
  return polygon;
}
