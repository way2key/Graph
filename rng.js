//hyper parameters
var players = [
  {name:"p1",ressources:[]},
  {name:"p2",ressources:[]}
];
var map;

function setup() {
  createCanvas(800,600);
  background(0);
  map = new Graph(players,25);
}

function draw() {
  fill(255);
  map.draw();
}

class Graph {
  constructor(players,size){
    this.players = players;
    this.nodes = [];

    //build all nodes
    for(let player of this.players){
      for(let i=0; i<size; ++i){
        if(player.name == "p1"){
          let add = new Node(random(width/2),random(height));
          this.nodes.push(add);
        }else{
          let add = new Node(width/2+random(width/2),random(height));
          this.nodes.push(add);
        }
      }
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
    console.log(this.neighbours);
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

  for(let test of nodes){
    if(test!=node1 && test!=node2){
      if(dist(node1.x,node1.y,test.x,test.y)<d && dist(node2.x,node2.y,test.x,test.y)<d){
        return false;
      }
    }
  }

  return true;
}
