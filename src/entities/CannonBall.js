import { Entity } from "./Entity.js";
import { Physical } from "../components/Physical.js";
import { Movable } from "../components/Movable.js";
import { Collidable } from "../components/Collidable.js";

export class CannonBall extends Entity {
  constructor(position, radii, speed) {
    super(position, true);
    this.radii = radii;
    this.addComponents(new Physical(500), new Movable(speed), new Collidable());
  }

  draw(ctx) {
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radii, 0, 2 * Math.PI);
    ctx.fill();
  }
}
