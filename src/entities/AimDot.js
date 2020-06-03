import { Entity } from "./Entity.js";

export class AimDot extends Entity {

    constructor(position) {
        super();
        this.position = position;
    }

    draw(ctx) {
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 6, 0, 2 * Math.PI);
        ctx.fill();
    }
}