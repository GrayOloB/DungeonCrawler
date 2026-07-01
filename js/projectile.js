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
        const p = player.body;
        const distX = Math.abs(this.x - (p.x + p.w / 2));
        const distY = Math.abs(this.y - (p.y + p.h / 2));

        if(distX > (p.w / 2 + this.radius)) return false;
        if(distY > (p.h / 2 + this.radius)) return false;

        if (distX <= (p.w / 2) || distY <= (p.h / 2)) {
            return true;
        }

        const dx = distX - p.w / 2;
        const dy = distY - p.h / 2;
        return (dx * dx + dy * dy <= (this.radius * this.radius));
    }
    draw(ctx, camera){
        ctx.beginPath();
        ctx.strokeStyle = "rgb(177, 19, 19)"; 
        ctx.fillStyle = "rgba(246, 120, 120, 0.97)"
        ctx.arc(this.x-camera.x, this.y-camera.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}