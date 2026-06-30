import { CONFIG } from "./config.js";

export class worldHandler{
    constructor(){
        this.gridSize = 9
        this.rooms = {
            START : "start",
            ENEMY : "enemy",
            ENEMY2 : "enemy2",
            BOSS : "boss",
            EMPTY : "empty"
        }
    }
    generateWorld(difficulty){
        const roomNum = Math.floor(Math.random()*2) + 6 + Math.floor(10 * difficulty / 3)
        const grid = Array.from({ length: this.gridSize }, () => new Array(this.gridSize).fill(this.rooms.EMPTY));
        let sX = 4, sY = 4;
        let maxDist = -1;
        let farX = 4, farY = 4;
        let shopX = 4, shopY = 4;
        grid[sX][sY] = "start";

        let filledRooms = [{x : sX, y: sY}];

        let dir = [
            {x : 0,  y : -1},
            {x : 0,  y : 1},
            {x : -1,  y : 0},
            {x : 1,  y : 0},
        ];

        while (filledRooms.length < roomNum){
            let rRoom = filledRooms[Math.floor(Math.random() * filledRooms.length)];
            let rDir = dir[Math.floor(Math.random() * dir.length)];
            
            let nX = rRoom.x + rDir.x;
            let nY = rRoom.y + rDir.y;
            if(nX >= 0 && nY >= 0 && nX<this.gridSize && nY < this.gridSize){
                const r = Math.floor(Math.random() * 5 + 1);//fight room type
                if (grid[nX][nY] === "empty") {
                    grid[nX][nY] = "fight_room_" + r.toString();
                    filledRooms.push({x : nX, y : nY})
                    //console.log(grid[nX][nY]);
                    let checkDist = Math.abs(sX - nX) + Math.abs(sY - nY);
                    if(checkDist > maxDist){
                        farX = nX;
                        farY = nY;
                        maxDist = checkDist;
                    }
                }
            }
        }
        
        grid[farX][farY] = "boss"
        let shopDist = -1;
        let c
        for(let i = 0; i < filledRooms.length; i++){
            let room = filledRooms[i]
            if((room.x === sX && room.y === sY) || (room.x === farX && room.y === farY)){
                continue;
            }
            let checkDist = Math.abs(farX - room.x) + Math.abs(farY - room.y);
            if(checkDist > shopDist){
                shopDist = checkDist;
                shopX = room.x;
                shopY = room.y;
            }
        }
        grid[shopX][shopY] = "shop"
        return grid;
    }
    printGrid(grid){
        let printString = "";
        for(let y = 0; y < this.gridSize; y++){
            for(let x = 0; x < this.gridSize; x++){
                if (grid[x][y] === "empty"){
                    printString += ("O ")
                } else if (grid[x][y] == "start"){
                    printString += ("S ")
                } else if (grid[x][y] == "boss"){
                    printString += ("B ")
                } else if (grid[x][y] == "shop"){
                    printString += ("s ")
                } else {
                    printString += ("e ")
                }
            }
            printString += ("\n")
        }
        console.log(printString);
    }
}