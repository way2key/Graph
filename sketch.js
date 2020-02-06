//hyper parameters
var players = [
  {name:"p1",ressources:[]},
  {name:"p2",ressources:[]}
];

var edgeNumber = {
  "hamlet":   {quantity:3, edges:1},
  "village":  {quantity:2, edges:2},
  "city":     {quantity:1, edges:4}
};

var map;


function setup() {
  createCanvas(800,600);
  background(0);
  map = new Graph(players, edgeNumber);
}

function draw() {
  fill(255);
  map.draw();

//shuffle(map.nodes);
}



class Graph {
  constructor(players, edgeConfig){
    this.players = players;
    this.edgeConfig = edgeConfig;
    this.nodes = [];

    // process the number of vertices
    this.nodeNumber = 0;
    for(let nodeType of Object.keys(this.edgeConfig)){
      this.nodeNumber += this.edgeConfig[nodeType].quantity;
    }

    for(let player of this.players){
      for(let nodeType of Object.keys(this.edgeConfig)){
        for(let i=0; i < this.edgeConfig[nodeType].quantity; ++i){
          if(player.name == "p1"){
            let add = new Node(random(width/2),random(height),this.edgeConfig[nodeType].edges);
            this.nodes.push(add);
          }else{
            let add = new Node(width/2+random(width/2),random(height),this.edgeConfig[nodeType].edges);
            this.nodes.push(add);
          }
        }
      }
    }

    for(let node of this.nodes){
      node.neighbours = node.getNeighbours(this.nodes, node.edges);
    }
  }

  draw(){
    background(0);
    for(let node of this.nodes){
      for(let edge of node.neighbours){
        line(node.x,node.y,this.nodes[edge].x,this.nodes[edge].y);
      }
    }
    for(let node of this.nodes){
      node.draw();
    }
  }
}

class Node {
  constructor(x, y, edges) {
    this.neighbours = [];
    this.x = x;
    this.y = y;
    this.edges = edges;
    this.size = 25;
  }

  draw() {
    fill(255);
    stroke(255);
    strokeWeight(5);
    switch (this.edges) {
      case 4:
        fill('rgb(255,0,0)');
        break;
      case 2:
        fill('rgb(0,255,0)');
        break;
      case 1:
        fill('rgb(0,0,255)');
        break;
      default:
      fill(255);

    }
    ellipse(this.x,this.y,this.size);
  }

  getNeighbours(nodes, number){
    var distances = [];
    for(let node of nodes){
      if(node.neighbours.length <= node.edges){
        distances.push(dist(node.x,node.y,this.x,this.y));
      }
    }
    return sortIndex(distances).splice(1,number);
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
