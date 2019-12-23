//hyper parameter
var village = 2;
var city = 2;
var hamlet = 2;

var map;


function setup() {
  createCanvas(800,600);
  background(0);
  map = new Graph(9);
}

function draw() {
  fill(255);
  map.draw();
}



class Graph {
  constructor(nodeNumber){
    this.nodeNumber  = nodeNumber;
    this.nodes = [];
    this.edges = [];

    for(let i = 0; i < nodeNumber ; ++i){
      let add = new Node(random(800),random(600),20);
      this.nodes.push(add);
    }
    for(let node of this.nodes){
      node.neighbours = node.getNeighbours(this.nodes);
    }
  }

  draw(){
    background(0);
    for(let node of this.nodes){
      node.draw();
      for(let edge of node.neighbours){
        line(node.x,node.y,this.nodes[edge].x,this.nodes[edge].y);
      }
    }
  }
}

class Node {
  constructor(x, y, edges) {
    this.neighbours = [];
    this.x = x;
    this.y = y;
    this.size = 25;
  }

  draw() {
    fill(255);
    stroke(255);
    strokeWeight(5);
    ellipse(this.x,this.y,this.size);
  }

  getNeighbours(nodes){
    var distances = [];
    for(let node of nodes){
      distances.push(dist(node.x,node.y,this.x,this.y));
    }
    return sortIndex(distances).splice(1,2);
  }
}

function sortIndex(toSort) {
  return toSort.map(
    (e,i) => {return {index: i, value: e};}
  ).sort(
    (a,b) => a.value - b.value
  ).map(
    (e,i) => {return e.index;},[]
  );
}
