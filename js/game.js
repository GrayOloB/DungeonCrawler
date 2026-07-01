// =============================================================
//  game.js - The conductor. Ties every system together.
// =============================================================
//  This file:
//    1. Loads assets, then the map.
//    2. Runs the GAME LOOP (update + draw, many times a second).
//    3. Keeps track of the current STATE (title, playing, dialogue,
//       inventory, gameover, win) and behaves differently in each.
//
//  THE GAME LOOP & "DELTA TIME"
//  ----------------------------
//  Computers run at different speeds. If we moved the player "2px
//  per frame", a fast computer would zoom and a slow one would crawl.
//  Instead we measure how many SECONDS passed since the last frame
//  (we call it `dt`, for "delta time") and move "speed * dt" pixels.
//  Now everyone moves the same real-world speed. That's what
//  "framerate independent" means.
// =============================================================

// ============================================================================
// STARTER STUB - you write this file during the code-along (Week 1, Day 3 (grows every week)).
// Follow the slides / Coding Companion for this week. If you fall behind,
// the complete version is in the matching weekN-checkpoint/js/game.js.
// ============================================================================

// TODO: build this file here.
import { CONFIG } from "./config.js";
import { loadAllAssets } from "./assets.js";
import { Input } from "./input.js";
import { Sound } from "./audio.js";
import { TileMap } from "./tilemap.js";
import { Camera } from "./camera.js";
import { Player } from "./player.js";
import { NPC } from "./npc.js";
import { Enemy } from "./enemy.js"
import { Item, Inventory } from "./item.js"
import { UI } from "./ui.js"
import { Floaters, Particles } from "./particles.js";
import { AttackHandler } from "./attackHandler.js";
import { worldHandler } from "./generateWorld.js";
import { Boss } from "./boss.js";

const STATE = {
    LOADING : "loading",
    TITLE : "title",
    PLAYING : "playing", 
    DIALOGUE : "dialogue", 
    INVENTORY : "inventory",
    GAMEOVER: "gameover",
    WIN: "win",
};

class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.lastTime = 0;
        this.state = STATE.LOADING;

        this.handler = new worldHandler()
        this.worldGrid = null;
        this.roomX = 4;
        this.roomY = 4;
        this.clearBuffer = 1;

        this.fightingBoss = false;
        this.bossfight = null;
        
    }
    async boot(){
        await loadAllAssets();
        //const res = await fetch("assets/room1.json");//("assets/map_meadow.json");
        //this.mapData = await res.json();
       // this.loadRoom();
       this.loadWorld();
        this.state = STATE.TITLE
        //this.loadWorld();
        requestAnimationFrame(this.loop.bind(this))
    }

    async loadWorld(){
        this.worldGrid = this.handler.generateWorld(1);
        this.handler.printGrid(this.worldGrid);
        this.roomX = 4;
        this.roomY = 4;
        

        //this.map = new TileMap(this.mapData);
        this.camera = new Camera();

        this.inventory = new Inventory();
        this.npcs = [];
        this.enemies = [];
        this.items = [];
        this.clearedRooms = [];
        await this.loadRoom();
        this.player = new Player(this.mapData.playerStart.x, this.mapData.playerStart.y)
        this.state = STATE.TITLE
        Sound.playMusic(this.mapData.music || "town_theme");
    }

    async loadRoom(){
        this.npcs = [];
        this.enemies = [];
        this.items = [];

        let grid = this.worldGrid
        let fileR = "assets/rooms/room1.json"
        let cRoom = grid[this.roomX][this.roomY]

        if(cRoom === "start"){
            fileR = "assets/rooms/starting_map.json"
        } else {
            fileR = "assets/rooms/" + cRoom + ".json"
        } 
        const res = await fetch(fileR);//("assets/map_meadow.json");
        this.mapData = await res.json();

        this.map = new TileMap(this.mapData);
        //this.player = new Player(this.mapData.playerStart.x, this.mapData.playerStart.y)
        let isCleared = false;
        for(let i = 0; i < this.clearedRooms.length; i++){
            if(this.clearedRooms[i].x === this.roomX &&
                this.clearedRooms[i].y === this.roomY){
                    isCleared = true;
                    break;
                }
        }
        for(const e of this.mapData.entities){
            if (e.kind === "npc") this.npcs.push(new NPC(e));
            else if (e.kind === "enemy"){ 
                if(!isCleared) {this.enemies.push(new Enemy(e))}
            }
            else if (e.kind === "item") this.items.push(new Item(e));
        }
        if(cRoom === "boss"){
            this.fightingBoss = true;
            this.bossfight = new Boss(this.map.pixelWidth/2, this.map.pixelHeight/2);
        }
    }
    roomChange(){
        const offset = CONFIG.SCALED_TILE * 1
        const p = this.player
        let changed = false;
        if(this.fightingBoss === true) return;

        if(p.x + p.width > this.map.pixelWidth){
            if(this.roomX + 1 === this.worldGrid.length) return;
            if(this.worldGrid[this.roomX+1][this.roomY] === "empty") return;
            this.roomX++;
            changed = true;
            this.player.x = offset/2
        }
        if(p.x < 0){
            if(this.roomX-1 < 0) return;
            if(this.worldGrid[this.roomX-1][this.roomY] === "empty") return;
            this.roomX--;
            changed = true;
            this.player.x = this.map.pixelWidth - offset
        }
        if(p.y + p.height > this.map.pixelHeight){
            if(this.roomY + 1 === this.worldGrid.length) return;
            if(this.worldGrid[this.roomX][this.roomY+1] === "empty") return;
            
            this.roomY++;
            changed = true;
            this.player.y = offset/2
        }
        if(p.y < 0){
            if(this.roomY-1 < 0) return;
            if(this.worldGrid[this.roomX][this.roomY-1] === "empty") return;
            
            this.roomY--;
            changed = true;
            this.player.y = this.map.pixelHeight - offset
        }
        if(changed){
            this.clearBuffer = 1;
            this.loadRoom()
           console.log(this.roomX + " " + this.roomY);
            
        }
    }
    loop(timestamp){
        let dt = (timestamp - this.lastTime)/1000;
        this.lastTime = timestamp;
        if(dt > 0.05) dt = 0.05;

        this.update(dt);
        this.draw();
        Input.clearFrame();
        requestAnimationFrame(this.loop.bind(this));
    }
    update(dt){
        Particles.update(dt);
        Floaters.update(dt);
       switch(this.state){
        case STATE.TITLE:
            if(Input.wasPressed("Space") || Input.wasPressed("Enter")){
               // this.loadWorld();
                this.state = STATE.PLAYING;
            }
            break;
        case STATE.PLAYING:
            this.updatePlaying(dt);
            break;
        case STATE.DIALOGUE:
            this.dialogue.update(dt);
            if(!this.dialogue.active) this.state = STATE.PLAYING;
            break;
       
       case STATE.INVENTORY:
            if(Input.wasPressed("KeyI") || Input.wasPressed("Escape")){
                Sound.play("select");
                this.state = STATE.PLAYING;
            }
            break;
        case STATE.GAMEOVER:
        case STATE.WIN:
            if (Input.wasPressed("Space") || Input.wasPressed("Enter")){
                this.state = STATE.TITLE
            }
            break;
       }
    }
    updatePlaying(dt){
        this.roomChange();
        if(this.clearBuffer > 0){
            this.clearBuffer -= dt;
        }
        //console.log(this.enemies);
        //console.log(this.roomX + " " + this.roomY)
        
        if(Input.wasPressed("KeyI")) {
            Sound.play("select");
            this.state = STATE.INVENTORY; 
            return;
        }

        this.nearbyNpc = this.npcs.find(n=> n.isNear(this.player));
        if(this.nearbyNpc && !this.player.attacking && Input.wasPressed("KeyT")){
            this.startConversation(this.nearbyNpc);
            return;
        }
        this.player.update(dt, this.map, this.camera);

        if(this.player.isDead){
            Sound.stopMusic();
            Sound.play("gameover");
            this.state = STATE.GAMEOVER;
            return;
        }
        if(this.fightingBoss && this.bossfight){
            this.bossfight.update(dt, this.player);
            if(this.bossfight.hp<=0){
                this.bossfight = null;
                this.fightingBoss = false;
                console.log("a");
            }
        }
        //Battle.resolvePlayerAttack(this.player, this.enemies, this.questLog);
        AttackHandler.resolvePlayerAttack(this.player, this.enemies);
        if(this.fightingBoss){
            AttackHandler.resolvePlayerAttack(this.player, [this.bossfight]);
        }
        for(const enemy of this.enemies){
            enemy.update(dt, this.player, this.map);
        }

        this.enemies = this.enemies.filter(e=>!e.dead);


        if(this.enemies.length === 0 && this.clearBuffer <= 0){
            let s = false
            for(let i = 0; i<this.clearedRooms.length; i++){
                if(this.clearedRooms[i].x === this.roomX &&
                    this.clearedRooms[i].y === this.roomY){
                        s = true;
                    }
            }
            if(!s){
                this.clearedRooms.push({x:this.roomX,y:this.roomY})
            }
        }

        for(const npc of this.npcs) npc.update(dt);

        for(const item of this.items){
            item.update(dt);
            if(!item.collected && item.overlaps(this.player)){
                item.collected = true;
                this.inventory.add(item.id, item.name);
                //this.questLog.onCollect(item.id);
                if(item.heal) this.player.heal(item.heal);
            }
        }
        this.items = this.items.filter(i => !i.collected);
        
        
        this.camera.follow(this.player, this.map);
    }
    spawnEnemy(type, x, y){
        let enemyData = {
            type:type,
            x:x,
            y:y,
            
        }
        this.enemies.push(new Enemy(enemyData));
    }
    startConversation(npc){
        this.state = STATE.DIALOGUE;
       // this.questLog.onTalk(npc.name);
        //const quest = npc.givesQuest ?
        //this.questLog.quests[npc.givesQuest] : null;
        let pages = npc.dialogue;
        let offersQuest = true;
        let handInNow = false;
        if (true) {
            offersQuest = false;
            const done = false //quest.objectives.every(o => o.current >= o.needed);
            if (done && npc.dialogueComplete && !quest.turnedIn) {
                pages = npc.dialogueComplete;
                handInNow = true;
            } else if (done) {
                pages = npc.dialogueComplete || npc.dialogueInProgress || npc.dialogue;
            } else {
                pages = npc.dialogueInProgress || npc.dialogue;
            }
        }

        this.dialogue.start(
            npc.name,
            pages,
            () => {
                if (false) {
                   // this.questLog.start(npc.givesQuest);
                }
                if (false) {
                    //quest.turnedIn = true;
                    //quest.checkComplete();
                }
                npc._declined = false;
            },
            (choiceIndex) => {
                if (choiceIndex === 1) npc._declined = true;
            }
        );
    }

    draw(){
        const ctx = this.ctx;
        ctx.fillStyle = "bfe0f2";
        ctx.fillRect(0,0,CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        if(this.state === STATE.LOADING){
            UI.drawScreen(ctx, "Loading...", "Gathering carrots and courage");
            return
        }
        if(this.state === STATE.TITLE){
            UI.drawScreen(ctx, "Rabbit Run: Tales of the Warran",
                "Press Space to begin", "#ffd98a");
            return;
        }
        
        this.map.drawLayer(ctx, "ground", this.camera);
        this.map.drawLayer(ctx, "overlay", this.camera);

        const things = [...this.items, ...this.npcs, ...this.enemies, this.player];
        things.sort((a,b) => (a.y + a.height) - (b.y + b.height));
        for (const t of things) t.draw(ctx, this.camera);
        
        if(this.fightingBoss){
            this.bossfight.draw(ctx, this.camera);
        }

        this.map.drawLayer(ctx, "decor", this.camera);
        Particles.draw(ctx,this.camera);
        Floaters.draw(ctx, this.camera);

        UI.drawHealth(ctx, this.player);
     //   UI.drawQuests(ctx, this.questLog);
        UI.drawMap(ctx, this.worldGrid, this.roomX,this.roomY);

        if(this.state === STATE.PLAYING && this.nearbyNpc){
            UI.drawPrompt(ctx, `Press T to talk to ${this.nearbyNpc.name}`);
        }
        if(this.state === STATE.DIALOGUE) {
            UI.drawDialogue(ctx, this.dialogue);
        }
        if(this.state === STATE.INVENTORY) {
            UI.drawInventory(ctx,this.inventory);
        }
        if(this.state === STATE.GAMEOVER){
            UI.drawScreen(ctx, "Game Over", "Press ENTER to try again", "#f08a8a");
        }
        if(this.state === STATE.WIN){
            UI.drawScreen(ctx, "You Win!", "Every quest complete! Enter for title", "#9ad9b0");
        }
    }
}
window.addEventListener("load", ()=> {
    const canvas = document.getElementById("game");
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;
    const game = new Game(canvas);

    window.game = game;
    game.boot();
})