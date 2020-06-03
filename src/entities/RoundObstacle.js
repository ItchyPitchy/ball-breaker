import { Entity } from "./Entity.js";
import { Collidable } from "../components/Collidable.js";
import { Destroyable } from "../components/Destroyable.js";

export class RoundObstacle extends Entity {

  constructor(position, radius, lives) {
    super();
    this.position = position;
    this.radius = radius;
    this.addComponents(
      new Collidable,
      new Destroyable(lives),
    )
  }

  draw(ctx) {

    switch(this.getComponent(Destroyable).hits) {
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
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  } 
}