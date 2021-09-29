import { System } from "./System.js";
import { Physical } from "../components/Physical.js";
import { Movable } from "../components/Movable.js";

export class GravitySystem extends System {
  constructor() {
    super();
  }

  appliesTo(entity) {
    return entity.hasComponent(Physical) && entity.hasComponent(Movable);
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      const movable = entity.getComponent(Movable);
      const fallSpeed = entity.getComponent(Physical).fallSpeed;
      movable.speed.y += fallSpeed * dt;
    }
  }

  clone() {
    return new GravitySystem();
  }
}
