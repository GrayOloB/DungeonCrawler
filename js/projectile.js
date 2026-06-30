import { CONFIG } from "./config.js";

export class Projectile{
    constructor(x,y,vx,vy,dmg){
        this.radius = 10;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = dmg;
    }
    update(dt){
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
    collidesWith(player){
        let p = player.body()
        var distX = Math.abs(this.x - p.x-p.width/2);
        var distY = Math.abs(this.y - p.y-p.height/2);

        if(distX > (p.width / 2 + this.radius)) return false;
        if(distY > (p.height / 2 + this.radius)) return false;

        let hit = false; 
        if (distX <= (p.width / 2)) {
            hit = true;
        } else if (distY <= (p.height / 2)) {
            hit = true;
        } else {
            const dx = distX - p.width / 2;
            const dy = distY - p.height / 2;
            hit = (dx * dx + dy * dy <= (this.radius * this.radius));
        }
        return hit;
    }
    draw(ctx, camera){
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 0, 0, 0.99)"
        ctx.arc(this.x-camera.x, this.y-camera.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}