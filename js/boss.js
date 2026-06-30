import { CONFIG } from "./config.js";
import { SpriteAnimator } from "./sprite.js";
import { Sound } from "./audio.js";
import { AStar } from "./astar.js";
import { Projectile } from "./projectile.js";

const STATE = { IDLE : "idle", ATTACK_1 : "atk1", ATTACK_2 : "atk2", DEAD : "dead"}

const TYPES = {
    slime : { //CHANGE LATER
        idleSheet: "slime_idle", hurtSheet : "slime_hurt", deathSheet : "slime_death",
        idleFrames : 8, hurtFrames : 2, deathFrames : 4,
        hp : 100, speed:100, damage:30, sightRange:300, attackRange:30, xp:10,
    },
};

export class Boss{
    constructor(x,y){
        this.x = x;
        this.t = TYPES["slime"];
        this.y = y;
        this.width = 200; //idk
        this.height = 200;

        this.state = STATE.IDLE
        this.speed = this.t.speed;
        this.hp = this.t.hp;
        this.dmg = this.t.damage;

        this.bullets = [];
        this.anim = new SpriteAnimator();
    }
    update(dt, player){
        this.updateBullets(dt, player)
    }
    updateBullets(dt, player){
        for(const bullet of this.bullets){
            bullet.update(dt);
            bullet.collidesWith(player);
        }
    }
    draw(ctx, camera){
        for(const bullet of this.bullets){
                    bullet.draw(ctx, camera);
        }
        const sx = this.x -  camera.x;
        const sy = this.y - camera.y;
        
        let sheet = this.t.idleSheet;

            
    }
}