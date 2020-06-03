import { Entity } from "./Entity.js";
import { Physical } from "../components/Physical.js";
import { Movable } from "../components/Movable.js";
import { Collidable } from "../components/Collidable.js";

export class Ball extends Entity {

    constructor(position, radius, speed) {
        super();
        this.position = position;
        this.radius = radius;
        this.addComponents(
            new Physical(9.82),
            new Movable(speed),
            new Collidable(),
        );
    }

    draw(ctx) {
        ctx.fillStyle = "#00f";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

}