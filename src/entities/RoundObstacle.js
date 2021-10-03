import { Entity } from "./Entity.js";
import { Collidable } from "../components/Collidable.js";
import { Destroyable } from "../components/Destroyable.js";

export class RoundObstacle extends Entity {
  constructor(position, radii, lives = 1) {
    super(position);
    this.radii = radii;
    this.addComponents(new Collidable(1), new Destroyable(lives));
  }

  draw(ctx) {
    switch (this.getComponent(Destroyable).hits) {
      case 1:
        ctx.fillStyle = "blue";
        break;
      case 2:
        ctx.fillStyle = "rgb(200, 0, 255)";
        break;
      case 3:
        ctx.fillStyle = "magenta";
        break;
    }
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radii, 0, 2 * Math.PI);
    ctx.fill();
  }

  clone() {
    const clone = new RoundObstacle(this.position, this.radii);
    const components = this.components.map((component) => component.clone());

    clone.markedForDeletion = this.markedForDeletion;

    clone.addComponents(components);

    return clone;
  }
}
