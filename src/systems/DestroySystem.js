import { Destroyable } from "../components/Destroyable.js";
import { System } from "./System.js";

export class DestroySystem extends System {
  appliesTo(entity) {
    return entity.hasComponent(Destroyable);
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      const hits = entity.getComponent(Destroyable).hits;
      if (hits <= 0) {
        game.entities.splice(game.entities.indexOf(entity), 1);
        console.log("R E M O V E _ _ _ E N T I T Y");
      }
    }
  }
}
