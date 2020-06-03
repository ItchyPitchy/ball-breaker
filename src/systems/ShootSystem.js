import { System } from "./System.js";
import { Cannon } from "../entities/Cannon.js";
import { Ball } from "../entities/Ball.js";
import { AimDot } from "../entities/AimDot.js";

export class ShootSystem extends System {

    constructor(game, level) {
        super();
        this.keys = new Set();
        this.mousePos;
        this.level = level;
        document.querySelector("#gameScreen").addEventListener("click", e => {
            if (game.gamestate === game.gamestates.RUNNING && game.currentLevel === this.level) {
                this.keys.add("leftClick");
                this.mousePos = {x: e.clientX - window.innerWidth / 2 + game.gameWidth / 2, y: e.clientY - window.innerHeight / 2 + game.gameHeight / 2};
            }
        })
        document.querySelector("#gameScreen").addEventListener("mousemove", e => {
            if (game.gamestate === game.gamestates.RUNNING && game.currentLevel === this.level) {
                this.keys.add("hover");
                this.mousePos = {x: e.clientX - window.innerWidth / 2 + game.gameWidth / 2, y: e.clientY - window.innerHeight / 2 + game.gameHeight / 2};
            }
        })
    }

    appliesTo(entity) {
        return entity instanceof Cannon
    }

    update(entities, dt, game) {

        game.entities.forEach((entity, index) => {
            if (entity instanceof AimDot) {
                game.entities.splice(index, 1);
            }
        })

        for (const entity of entities) {



            if (this.mousePos && !game.entities.find((entity) => entity instanceof Ball)) {

                // const vector = new Vector(e.clientX - this.position.x, e.clientY - this.position.y);
                // this.game.entities.push(new Ball(this.game, { ...position }, new Vector().multiplyScalar(vector, 10)));
                
                const angle = Math.atan((this.mousePos.y - entity.position.y) / (this.mousePos.x - entity.position.x));
                entity.degrees = angle;

                // const speedX = Math.cos(angle) * 20;
                // const speedY = Math.sin(angle) * 20;
                let speed = {x: (this.mousePos.x - entity.position.x) * 4, y: (this.mousePos.y - entity.position.y) * 4};
                let magnitude = Math.sqrt(speed.x * speed.x + speed.y * speed.y);
                const norm = {x: speed.x / magnitude, y: speed.y / magnitude};

                if (magnitude > 800) {
                    magnitude = 800;
                }

                speed = {x: norm.x * magnitude, y: norm.y * magnitude};

                if (this.keys.has("leftClick")) {
                    console.log(speed)
                    game.entities.push(new Ball({x: entity.position.x, y: entity.position.y}, 16, {x: speed.x, y: speed.y}));
                    game.levels[game.currentLevel].balls--;
    
                    this.keys.delete("leftClick");
                }


                for (let i = 0; i < 5; i++) {
                    const pos = {x: entity.position.x + (speed.x * i / 5), y: entity.position.y + (speed.y * i / 5) + i * 9.82 * dt}
                    game.entities.push(new AimDot({x: pos.x, y: pos.y}));
                }
            }
            
        }
    }

}