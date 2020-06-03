import { Entity } from "./Entity.js";

export class Cannon extends Entity {

    constructor(position) {
        super();
        this.position = position;
        this.degrees;
    }

    draw(ctx) {

        // Matrix transformation
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.degrees);
        ctx.translate(-(this.position.x + 140 / 2), -(this.position.y + 75 / 2));

        // Rotated rectangle
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 140, 75);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

}