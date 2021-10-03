import { Entity } from "./Entity.js";
import { Physical } from "../components/Physical.js";
import { Vector } from "../components/Vector.js";
import { Collidable } from "../components/Collidable.js";

export class CannonBall extends Entity {
  constructor(position, radii, velocity = { x: 0, y: 0 }) {
    super(position, true);
    this.radii = radii;
    this.addComponents(
      new Physical(500),
      new Vector(velocity.x, velocity.y),
      new Collidable(0.95)
    );
  }

  draw(ctx) {
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radii, 0, 2 * Math.PI);
    ctx.fill();
  }

  clone() {
    const clone = new CannonBall(this.position, this.radii);
    clone.components = [];

    const components = this.components.map((component) => component.clone());
    clone.addComponents(...components);

    clone.markedForDeletion = this.markedForDeletion;

    return clone;
  }
}
