import { System } from "./System.js";
import { Collidable } from "../components/Collidable.js";
import { Destroyable } from "../components/Destroyable.js";
import { circleFunctions } from "../circleFunctions.js";

export class CollisionSystem extends System {
  constructor() {
    super();
  }

  appliesTo(entity) {
    return entity.hasComponent(Collidable);
  }

  update(entities, dt, game) {
    for (const entity1 of entities) {
      for (const entity2 of entities) {
        if (entity1 === entity2) continue;

        if (circleFunctions.circleIntersect(entity1, entity2)) {
          circleFunctions.resolveCollision(entity1, entity2, dt);

          for (const entity of [entity1, entity2]) {
            if (entity.hasComponent(Destroyable)) {
              entity.getComponent(Destroyable).hits -= 1;
            }
          }
        }
      }
    }
  }
  clone() {
    return new CollisionSystem();
  }
}
