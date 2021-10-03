import { System } from "./System.js";
import { Physical } from "../components/Physical.js";
import { Vector } from "../components/Vector.js";

export class GravitySystem extends System {
  constructor() {
    super();
  }

  appliesTo(entity) {
    return entity.hasComponent(Physical) && entity.hasComponent(Vector);
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      const vector = entity.getComponent(Vector);
      const fallSpeed = entity.getComponent(Physical).fallSpeed;
      vector.y += fallSpeed * dt;
    }
  }

  clone() {
    return new GravitySystem();
  }
}
