import { Movable } from "../components/Movable.js";
import { System } from "./System.js";

export class MoveSystem extends System {
  appliesTo(entity) {
    return entity.hasComponent(Movable);
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      const speed = entity.getComponent(Movable).speed;

      entity.position.x += speed.x * dt;
      entity.position.y += speed.y * dt;
    }
  }
}
