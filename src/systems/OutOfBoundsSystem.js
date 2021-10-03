import { Vector } from "../components/Vector.js";
import { System } from "./System.js";

export class OutOfBoundsSystem extends System {
  constructor() {
    super();
  }

  appliesTo(entity) {
    return entity.inBoundsOnly && entity.hasComponent(Vector);
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      const speed = entity.getComponent(Vector).speed;

      //wall on right
      if (entity.position.x + entity.radius >= game.gameWidth) {
        entity.position.x = game.gameWidth - entity.radius;
        speed.x = -speed.x;
      }

      // wall on left
      if (entity.position.x - entity.radius <= 0) {
        entity.position.x = 0 + entity.radius;
        speed.x = -speed.x;
      }

      // wall on top
      if (entity.position.y - entity.radius <= 0) {
        entity.position.y = 0 + entity.radius;
        speed.y = -speed.y;
      }

      //wall on bottom
      if (entity.position.y - entity.radius >= game.gameHeight) {
        game.entities = game.entities.filter((element) => element !== entity);
      }
    }
  }

  clone() {
    return new OutOfBoundsSystem();
  }
}
