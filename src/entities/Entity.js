import { Vector } from "../components/Vector";

export class Entity {
  constructor(position, inBoundsOnly = false) {
    this.components = [];
    this.position = position;
    this.inBoundsOnly = inBoundsOnly;
    this.markedForDeletion = false;
  }

  distanceTo(entity) {
    return Math.sqrt(
      Math.pow(this.position.x - entity.position.x, 2) +
        Math.pow(this.position.y - entity.position.y, 2)
    );
  }

  vectorTo(entity) {
    return new Vector(
      this.position.x - entity.position.x,
      this.position.y - entity.position.y
    );
  }

  getComponent(type) {
    for (const component of this.components) {
      if (component instanceof type) {
        return component;
      }
    }
  }

  addComponents(...components) {
    for (const component of components) {
      this.components.push(component);
    }
  }

  hasComponent(type) {
    for (const component of this.components) {
      if (component instanceof type) {
        return true;
      }
    }
  }

  removeComponent(type) {
    this.components = this.components.filter(
      (component) => component instanceof type
    );
  }

  draw(ctx) {
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 16, 0, 2 * Math.PI);
    ctx.fill();
  }
}
