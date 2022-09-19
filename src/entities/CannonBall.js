import { Entity } from "./Entity.js";
import { Physical } from "../components/Physical.js";
import { Vector } from "../components/Vector.js";
import { Collidable } from "../components/Collidable.js";

export class CannonBall extends Entity {
  constructor(position, radius, velocity = { x: 0, y: 0 }) {
    super(position, true);
    this.radius = radius;
    this.addComponents(
      new Physical(500),
      new Vector(velocity.x, velocity.y),
      new Collidable(0.95)
    );
  }

  draw(ctx) {
    // ctx.save();
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.restore();
  }

  clone() {
    const clone = new CannonBall(this.position, this.radius);
    clone.components = [];

    const components = this.components.map((component) => component.clone());
    clone.addComponents(...components);

    clone.markedForDeletion = this.markedForDeletion;

    return clone;
  }
}
