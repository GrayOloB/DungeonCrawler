import { CONFIG } from "./config.js";

export const AttackHandler = {
    resolvePlayerAttack(player, enemies){
        if(!player.attacking) return;

        const sword = player.getSwordHitbox();

        for (const enemy of enemies){
            if(enemy.state === "dead") continue;
            var distX = Math.abs(sword.x - enemy.x-enemy.width/2);
            var distY = Math.abs(sword.y - enemy.y-enemy.height/2);

            if(distX > (enemy.width / 2 + sword.radius)) continue;
            if(distY > (enemy.height / 2 + sword.radius)) continue;

            let hit = false; 
            if (distX <= (enemy.width / 2)) {
                hit = true;
            } else if (distY <= (enemy.height / 2)) {
                hit = true;
            } else {
                const dx = distX - enemy.width / 2;
                const dy = distY - enemy.height / 2;
                hit = (dx * dx + dy * dy <= (sword.radius * sword.radius));
            }
            
            if(!hit || enemy.beenHit){ continue }
            enemy.beenHit = true;
            const wasAlive = enemy.hp > 0;
            enemy.takeDamage(player.attackDamage)
            player.attackHasHit = true; 

            if(wasAlive && enemy.hp <= 0){
                player.gainXP(enemy.xpReward);
            }
            //break;

        }
    }
}