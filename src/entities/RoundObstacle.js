import { Entity } from "./Entity.js";
import { Collidable } from "../components/Collidable.js";
import { Destroyable } from "../components/Destroyable.js";
import circleBlue from "../assets/images/full-moon.png";
import circleBlack from "../assets/images/circle_black.png";
import circleLightblue from "../assets/images/circle_lightblue.png";

export class RoundObstacle extends Entity {
  constructor(position, radius, lives = 1) {
    super(position);
    this.radius = radius;
    this.addComponents(new Collidable(1), new Destroyable(lives));
    this.texture = new Image();
  }

  draw(ctx) {
    // this.texture.onload = () => {
    ctx.save();

    switch (this.getComponent(Destroyable).hits) {
      case 1:
        this.texture.src = circleLightblue;
        break;
      case 2:
        this.texture.src = circleBlack;
        break;
      case 3:
        this.texture.src = circleBlack;
        break;
    }

    ctx.beginPath();
    ctx.rect(
      this.position.x - this.radius,
      this.position.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    ctx.closePath();
    ctx.drawImage(
      this.texture,
      this.position.x - this.radius,
      this.position.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    // ctx.clip();
    ctx.restore();
    // };
    // const image = new Image();
    // image.src = circleBlue;

    // switch (this.getComponent(Destroyable).hits) {
    //   case 1:
    //     ctx.fillStyle = "blue";
    //     break;
    //   case 2:
    //     ctx.fillStyle = "rgb(200, 0, 255)";
    //     break;
    //   case 3:
    //     ctx.fillStyle = "magenta";
    //     break;
    // }
    // ctx.beginPath();
    // ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    // ctx.fill();
  }

  clone() {
    const clone = new RoundObstacle(this.position, this.radius);
    const components = this.components.map((component) => component.clone());

    clone.markedForDeletion = this.markedForDeletion;

    clone.addComponents(components);

    return clone;
  }
}
