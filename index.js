var ctrlCode = 17
var w = 400
var h = 400
var cloth
var ctrl
var gravity
var running
var lastCloth = `{"points":[{"position":{"x":122,"y":137},"color":"green","affectedByGravity":false,"id":0},{"position":{"x":282,"y":117},"color":"green","affectedByGravity":false,"id":1},{"position":{"x":240,"y":230},"color":"green","affectedByGravity":false,"id":2},{"position":{"x":121,"y":237},"color":"red","affectedByGravity":true,"id":3}],"connections":[{"point1":2,"point2":0},{"point1":3,"point2":1},{"point1":3,"point2":2}]}`

var toggleStartButton
var recordClothButton
var loadClothButton
var resetButton

function setup() {
    createCanvas(w,h);
    gravity = createVector(0,0.1)
    frameRate(20)
    
    
    toggleStartButton = createButton("Start");
    // toggleStartButton.position(w,0);
    toggleStartButton.mousePressed(toggleStart);
    running=false
    
    recordClothButton = createButton("Record");
    recordClothButton.mousePressed(recordCloth)
    
    loadClothButton = createButton("Load");
    loadClothButton.mousePressed(()=>{loadCloth(lastCloth)})

    resetButton = createButton("Reset");
    resetButton.mousePressed(init)
    init()
}
function init(){
    cloth = new Cloth()
}

function draw() {
    background(220);
    ctrl=false
    if (keyIsDown(ctrlCode)){
        ctrl=true
    }
    cloth.Draw()
    if (running){
        cloth.Tick(h,w,gravity)
    }
}
function toggleStart(){
    running = !running
    toggleStartButton.html(running ? 'Stop' : 'Start');
}
function recordCloth(){
    console.log(JSON.stringify(cloth.Record()))
}
function loadCloth(str){
    const obj = JSON.parse(str)
    console.log(obj)
    cloth = Cloth.Load(obj)
}
function mouseReleased(){
    cloth.ReleaseDrag()
}
function mouseDragged(event){
    if(mouseX>=0 && mouseX < h  && mouseY>=0 && mouseY < w){
        if(running){
            const v = createVector(mouseX,mouseY);
            // console.log(v.x,v.y)
            cloth.HandleDrag(v,ctrl)
        }
    }
}
function mousePressed(event){
    const v = createVector(mouseX,mouseY);
    if(!running){
        if(v.x>=0 && v.y < h  && v.x>=0 && v.y < w){
            cloth.HandleClick(v,ctrl)
        }
    }else{
        cloth.StartDrag(v)
    }
}