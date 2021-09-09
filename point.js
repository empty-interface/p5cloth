
class Point{
    previousPosition
    affectedByGravity
    color
    selectedColor = 'blue'
    velocity
    acceleration
    selected
    id
    constructor(x,y,affectedByGravity=false,id){
        this.position = createVector(x,y)
        this.velocity = createVector(0,0)
        this.acceleration = createVector(0,0)
        this.affectedByGravity=affectedByGravity;
        this.color = 'green'
        if(affectedByGravity){
            this.color = 'red'
        }
        this.selected = false
        this.id=id
    }
    Draw(){
        let color = this.color
        if(this.selected){
            color = this.selectedColor
        }
        stroke(color); // Change the color
        strokeWeight(10);
        point(this.position.x,this.position.y)
    }
    ApplyForce(force){
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }
    ApplyGravityForce(gravity){
        // console.log(gravity )
        this.ApplyForce(gravity)
    }
    Clamp(h,w){
        if( this.position.x>w || this.position.x<0 || this.position.y>h || this.position.y<0)
        {
            this.velocity.mult(0)
            this.acceleration.mult(0)
        }
    }
    IsClicked(v){
        let dist = p5.Vector.dist(this.position,v)
        return dist < 5
    }
    Tick(h,w,gravity){
        if (this.affectedByGravity){
            // this.position.add(p5.Vector.mult(gravity.copy(),50))
            this.ApplyGravityForce(gravity)
        }
        
        this.Clamp(h,w)
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        this.acceleration.mult(0)
    }
}