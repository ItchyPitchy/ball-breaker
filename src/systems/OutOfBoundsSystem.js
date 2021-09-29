import { Movable } from "../components/Movable.js";
import { System } from "./System.js";

export class OutOfBoundsSystem extends System {
  constructor() {
    super();
  }

  appliesTo(entity) {
    return entity.inBoundsOnly && entity.hasComponent(Movable);
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      const speed = entity.getComponent(Movable).speed;

      //wall on right
      if (entity.position.x + entity.radii >= game.gameWidth) {
        entity.position.x = game.gameWidth - entity.radii;
        speed.x = -speed.x;
      }

      // wall on left
      if (entity.position.x - entity.radii <= 0) {
        entity.position.x = 0 + entity.radii;
        speed.x = -speed.x;
      }

      // wall on top
      if (entity.position.y - entity.radii <= 0) {
        entity.position.y = 0 + entity.radii;
        speed.y = -speed.y;
      }

      //wall on bottom
      if (entity.position.y - entity.radii >= game.gameHeight) {
        game.entities = game.entities.filter((element) => element !== entity);
      }
    }
  }

  clone() {
    return new OutOfBoundsSystem();
  }
}
