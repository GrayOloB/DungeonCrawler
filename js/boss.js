import { CONFIG } from "./config.js";
import { Images } from "./assets.js";
import { Sound } from "./audio.js";
import { AStar } from "./astar.js";
import { Projectile } from "./projectile.js";

const STATE = { IDLE : "idle", ATTACK_1 : "atk1", ATTACK_2 : "atk2", DEAD : "dead"}

const TYPES = {
    slime : { //CHANGE LATER
        idleSheet: "slime_idle", hurtSheet : "slime_hurt", deathSheet : "slime_death",
        idleFrames : 8, hurtFrames : 2, deathFrames : 4,
        hp : 100, speed:100, damage:5, sightRange:300, attackRange:30, xp:10,
    },
};

export class Boss{
    constructor(x,y){
        this.x = x;
        this.t = TYPES["slime"];
        this.y = y;
        this.width = 192;
        this.height = 192;
        this.frameIndex = 0;
        this.frames = this.t.idleFrames;

        this.state = STATE.IDLE
        this.speed = this.t.speed;
        this.hp = this.t.hp;
        this.dmg = this.t.damage;
        this.beenHit = false;
        this.hitCooldown = .5;

        this.bullets = [];
        this.bulletSpeed = 90;
        this.frameTimer = 0;
        this.frameDuration = 0.12;
        this.cooldown = 1;
        this.randomizeCooldown = 1;
        this.patternType = 1;
        this.numAttacks = 0;
    }
    takeDamage(amount){
        this.hp -= amount;
        this.beenHit = true;
        console.log("boss" + this.hp);
    }
    update(dt, player){
        this.frameTimer += dt;
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer -= this.frameDuration;
            this.frameIndex = (this.frameIndex + 1) % this.t.idleFrames;
        }
        this.updateBullets(dt, player)
        this.cooldown -= dt;
        this.randomizeCooldown -= dt;
        this.hitCooldown -= dt;
        if(this.beenHit && this.hitCooldown <= 0){
            this.beenHit = false;
            this.hitCooldown = .8;
        }
        if(this.randomizeCooldown <= 0){
            this.patternType = Math.floor(Math.random() * 6) + 1;
            console.log("Pattern: " + this.patternType);
            this.randomizeCooldown = 3;
            if(this.patternType === 1) {
                this.cooldown = 1;
                this.randomizeCooldown = 1 + 5;
            }
            if(this.patternType === 2) {
                this.cooldown = 1.5;
                this.randomizeCooldown = 8;
            }
            if(this.patternType === 3){
                this.cooldown = 2;
                this.randomizeCooldown = 6;
            }
            if(this.patternType === 4){
                this.cooldown = 2.5;
                this.randomizeCooldown = 5;
            }
            if(this.patternType === 5){
                this.cooldown = 1.75;
                this.randomizeCooldown = 7;
            }
            if(this.patternType === 6){
                this.cooldown = 2.25;
                this.randomizeCooldown = 6;
            }
            
        }
        if(this.cooldown <= 0){
            let r = (Math.random() * 2 + 1);
            if(this.patternType === 1) {
                this.bulletPattern(Math.floor(r*8), player, 360);
                this.cooldown = 1;
            }
            if(this.patternType === 2) {
                this.bulletPattern(100, player, 90);
                this.cooldown = 1.5;
            }
            if(this.patternType === 3) {
                this.bulletPattern(50, player, 130);
                this.cooldown = 2;
            }
            if(this.patternType === 4) {
                this.bulletPattern(80, player, 10, 150);
                this.cooldown = 2.5;
            }
            if(this.patternType === 5) {
                this.bulletPattern(15, player, 250);
                this.cooldown = 1.75;
            }
            if(this.patternType === 6) {
                this.bulletPattern(4, player, 3, 200);
                this.cooldown = .25;
            }
            this.numAttacks++;
        }
    }
    bulletPattern(numBullets, player, spread = 180, Bspeed = this.bulletSpeed){
        const dx = player.x + player.width / 2 - (this.x + this.width / 2);
        const dy = player.y + player.height / 2 - (this.y + this.height / 2);
        const playaAngle = Math.atan2(dy, dx);
        const halfSpread = (spread * Math.PI) / 180 / 2;

        for(let i = 0; i < numBullets; i++){
            const t = (i - (numBullets - 1) / 2) / Math.max(1, numBullets - 1);
            const angle = playaAngle + t * (spread * Math.PI / 180);
            const vx = Math.cos(angle) * Bspeed;
            const vy = Math.sin(angle) * Bspeed;
            this.bullets.push(new Projectile(this.x + this.width / 2, this.y + this.height / 2, vx, vy, this.dmg));
        }
    }
    updateBullets(dt, player){
        for(const bullet of this.bullets){
            bullet.update(dt);
            if(bullet.collidesWith(player)){
                player.takeDamage(bullet.damage);
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
            }
        }
    }
    draw(ctx, camera){
        for(const bullet of this.bullets){
            bullet.draw(ctx, camera);
        }
        const sx = this.x -  camera.x;
        const sy = this.y - camera.y;
        const sheet = Images[this.t.idleSheet];
        const animIndex = this.frameIndex * 48;

        ctx.drawImage(sheet, animIndex+16, 16, 16, 16, sx, sy, this.width, this.height);
        ctx.fillStyle = "rgba(252, 128, 128, 0.2)";
        ctx.fillRect(sx, sy, this.width, this.height);
        
    }
}