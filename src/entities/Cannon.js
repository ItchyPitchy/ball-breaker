import { Entity } from "./Entity.js";

export class Cannon extends Entity {
  constructor(position) {
    super(position);
    this.degrees;
  }

  draw(ctx) {
    // Matrix transformation
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.degrees);
    ctx.translate(-30, -(20 / 2));

    // Rotated rectangle
    ctx.fillStyle = "red";
    ctx.fillRect(50, 0, 30, 20);

    ctx.restore();
  }

  clone() {
    const clone = new Cannon(this.position);
    const components = this.components.map((component) => component.clone());

    clone.degrees = this.degrees;
    clone.markedForDeletion = this.markedForDeletion;

    clone.addComponents(components);

    return clone;
  }
}
