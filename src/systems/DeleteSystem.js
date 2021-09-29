import { System } from "./System.js";

export class DeleteSystem extends System {
  appliesTo(entity) {
    return true;
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      if (entity.markedForDeletion) {
        game.entities.splice(game.entities.indexOf(entity), 1);
        console.log("R E M O V E _ _ _ E N T I T Y");
      }
    }
  }
}
