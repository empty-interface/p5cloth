class Cloth{
    connections = []
    selectedPoint
    draggedPoint
    dragging = false
    lastPos
    constructor(){
        this.points = []
    }   
    idcount = 0
    Tick(h,w,gravity){
        this.points.forEach(point => {
            point.Tick(h,w,gravity)
        });
        this.connections.forEach(conn =>{
            conn.Tick()
        })
    }
    Draw(){
        this.points.forEach(point => {
            point.Draw()
        });
        this.connections.forEach(conn =>{
            conn.Draw()
        })
    }
    StartDrag(pos){
        this.dragging = true
        this.lastPos = pos
    }
    ReleaseDrag(){
        this.draggedPoint = undefined
        this.dragging = false
    }
    HandleDrag(pos){
        if(this.dragging === false){
            return
        }
        if(this.draggedPoint === undefined){
            for (let i = 0; i < this.points.length; i++) {
                const point = this.points[i];
                if(point.IsClicked(pos)){
                    this.draggedPoint=point
                    break
                }
            }
        }
        if(this.draggedPoint !== undefined){
            if(this.lastPos === undefined){
                this.lastPos = pos
            }else{
                pos.sub(this.lastPos)
                pos.normalize() 
                // pos.mult(20)
                this.draggedPoint.ApplyForce(pos)
            }
        }
    }
    HandleClick(pos,ctrl){
        let previousSelectedPoint = undefined
        let noneSelected = true
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            if(point.IsClicked(pos)){
                point.selected = true
                previousSelectedPoint = this.selectedPoint
                this.selectedPoint = point
                noneSelected = false
                break
            }
        }
        if(previousSelectedPoint && previousSelectedPoint=== this.selectedPoint){
            return
        }
        if(noneSelected){
            this.points.push(new Point(pos.x,pos.y,ctrl,this.idcount++))
            if(this.selectedPoint)
                this.selectedPoint.selected = false
            this.selectedPoint = undefined
        }else if(previousSelectedPoint){
            this.connections.push(new Connection(previousSelectedPoint,this.selectedPoint))
            previousSelectedPoint.selected = false
            this.selectedPoint.selected = false
            this.selectedPoint=undefined
        }
    }
    Record(){
        let obj ={};
        obj.points = this.points.map((point) => {
            return {
                position:{
                    x:point.position.x,
                    y:point.position.y,
                },
                color:point.color,
                affectedByGravity:point.affectedByGravity,
                id:point.id
            }
        })
        obj.connections = this.connections.map((conn)=>{
            return {
                point1:conn.point1.id,
                point2:conn.point2.id
            }
        })
        return obj
    }
    static Load(obj){
        let cloth = new Cloth();
        cloth.points = obj.points.map((point)=>{
            return new Point(point.position.x,point.position.y,point.affectedByGravity,point.id)
        })
        cloth.connections = obj.connections.map((conn)=>{
            const point1=cloth.points.find((point)=>{
                return point.id === conn.point1
            });
            const point2=cloth.points.find((point)=>{
                return point.id === conn.point2
            });
            console.log("point1",point1)
            console.log("point2",point2)
            return new Connection(point1,point2)
        })
        return cloth
    }
}
class Connection{
    point1
    point2
    constructor(point1,point2){
        this.point1 = point1
        this.point2 = point2
        this.len = p5.Vector.dist(this.point1.position, this.point2.position)
    }
    Draw() {
        strokeWeight(4);
        stroke(10)
        // console.log(this.point1,this.point2)
        line(this.point1.position.x,this.point1.position.y,this.point2.position.x,this.point2.position.y)
    }
    Tick(){
        let center = this.point1.position.copy()
        center.add(this.point2.position)
        center.div(2)
        // stroke('blue')
        // point(center.x,center.y)
        let dir = this.point1.position.copy()
        dir.sub(this.point2.position)
        dir.normalize()
        if(this.point1.affectedByGravity){
            let b = dir.copy()
            b.mult(this.len/2)
            let a = center.copy()
            a.add(b)
            // drawArrow(center,a,'blue')
            this.point1.position = a
        }
        if(this.point2.affectedByGravity){
            let b = dir.copy()
            b.mult(this.len/2)
            let a = center.copy()
            a.sub(b)
            // console.log(a.x,a.y)
            this.point2.position = a
        }
    }
}