import { CONFIG } from "./config.js";

export class worldHandler{
    constructor(){
        this.gridSize = 9
        this.rooms = {
            START : "start",
            ENEMY : "enemy",
            BOSS : "boss",
            EMPTY : "empty"
        }
    }
    generateWorld(){
        const roomNum = Math.floor((Math.random()*4 + 0.5) + 5)
        const grid = Array.from({ length: this.gridSize }, () => new Array(this.gridSize).fill(this.rooms.EMPTY));
        let sX = 4, sY = 4;
        grid[sX][sY] = this.rooms.START;

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
                if (grid[nX][nY] === this.rooms.EMPTY) {
                    grid[nX][nY] = this.rooms.ENEMY;
                    filledRooms.push({x : nX, y : nY})
                }
            }
        }
        return grid;
    }
    printGrid(grid){
        let printString = "";
        for(let y = 0; y < this.gridSize; y++){
            for(let x = 0; x < this.gridSize; x++){
                if (grid[x][y] === this.rooms.EMPTY){
                    printString += ("0 ")
                } else if (grid[x][y] == this.rooms.ENEMY){
                    printString += ("E ")
                } else {
                    printString += ("S ")
                }
            }
            printString += ("\n")
        }
        console.log(printString);
    }
}