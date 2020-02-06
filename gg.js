//hyper parameters
var map;

function setup() {
  createCanvas(800,600);
  background(0);
  map = new Graph(50);
}

function draw() {
  fill(255);
  map.draw();
}

class Graph {
  constructor(size){
    this.nodes = [];

    //build all nodes
    for(let i=0; i<size; ++i){
      let add = new Node(random(width),random(height));
      this.nodes.push(add);
    }

    //build adjacency list
    for(let node of this.nodes){
      node.getNeighbours(this.nodes);
    }
  }

  draw(){
    background(0);
    //draw edges
    for(let nodeStart of this.nodes){
      for(let nodeEnd of nodeStart.neighbours){
        line(nodeStart.x,nodeStart.y,nodeEnd.x,nodeEnd.y);
      }
    }
    //draw nodes
    for(let node of this.nodes){
      node.draw();
    }
  }
}

class Node {
  constructor(x, y) {
    this.neighbours = [];
    this.x = x;
    this.y = y;
    this.size = 15;
  }

  draw() {
    fill(255,0,0);
    stroke(255);
    strokeWeight(5);
    ellipse(this.x,this.y,this.size);
  }

  getNeighbours(nodes){
    for(let node of nodes){
      if(node != this){
        if(shouldConnect(this,node,nodes)){
          this.neighbours.push(node);
        }
      }
    }
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

function shouldConnect(node1,node2,nodes){
  let d = dist(node1.x,node1.y,node2.x,node2.y);
  /*
  let x = (node1.x + node2.x)/2;
  let y = (node1.y + node2.y)/2;
  for(let test of nodes){
    if(test!=node1 && test!=node2){
      if(dist(x,y,test.x,test.y)<=d/2){
        return false;
      }
    }
  }
  return true;*/

  for(let test of nodes){
    if(test!=node1 && test!=node2){
      if(!(d <= Math.sqrt(Math.pow(dist(node1.x,node1.y,test.x,test.y),2) + Math.pow(dist(node2.x,node2.y,test.x,test.y),2)))){
        return false;
      }
    }
  }
  return true;

}
