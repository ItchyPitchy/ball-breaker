import { collisionFunctions } from "../collisionFunctions.js";
import { Collidable } from "../components/Collidable.js";
import { Destroyable } from "../components/Destroyable.js";
import { Vector } from "../components/Vector.js";
import { System } from "./System.js";

export class MoveSystem extends System {
  constructor() {
    super();
  }

  appliesTo(entity) {
    return entity.hasComponent(Vector);
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      const collidableObjects = game.entities.filter(
        (object) => object.hasComponent(Collidable) && object !== entity
      );

      const vector = entity.getComponent(Vector);

      let timeLeft = 0.016;
      let count = 0;

      while (count < 50) {
        count++;

        let earliestCollision;

        // wall on right
        if (entity.position.x + vector.x * timeLeft + 16 >= game.gameWidth) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs(
                (game.gameWidth - 16 - entity.position.x) /
                  (vector.x * timeLeft)
              );
          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  entity.position.x +
                  vector.x * (timeLeft - timeLeftAfterCollision),
                y:
                  entity.position.y +
                  vector.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: -vector.x,
                y: vector.y,
              },
            };
          }
        }

        // wall on left
        if (entity.position.x + vector.x * timeLeft - 16 <= 0) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs((entity.position.x - 16) / (vector.x * timeLeft));

          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  entity.position.x +
                  vector.x * (timeLeft - timeLeftAfterCollision),
                y:
                  entity.position.y +
                  vector.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: -vector.x,
                y: vector.y,
              },
            };
          }
        }

        // wall on top
        if (entity.position.y + vector.y * timeLeft - 16 <= 0) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs((entity.position.y - 16) / (vector.y * timeLeft));

          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  entity.position.x +
                  vector.x * (timeLeft - timeLeftAfterCollision),
                y:
                  entity.position.y +
                  vector.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: vector.x,
                y: -vector.y,
              },
            };
          }
        }

        // wall on bottom
        if (entity.position.y + vector.y * timeLeft - 16 >= game.gameHeight) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs(
                (game.gameHeight - entity.position.y + 16) /
                  (vector.y * timeLeft)
              );

          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  entity.position.x +
                  vector.x * (timeLeft - timeLeftAfterCollision),
                y:
                  entity.position.y +
                  vector.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: vector.x,
                y: vector.y,
              },
              outOfBounds: true,
            };
          }
        }

        // const cannonBall = entity.clone();

        for (const object of collidableObjects) {
          if (
            object.markedForDeletion ||
            (object.hasComponent(Destroyable) &&
              object.getComponent(Destroyable).hits <= 0)
          ) {
            continue;
          }

          const collision = collisionFunctions.getCollision(
            entity,
            object,
            timeLeft
          );

          if (collision) {
            if (
              !earliestCollision ||
              collision.timeLeftAfterCollision >
                earliestCollision.timeLeftAfterCollision
            ) {
              earliestCollision = collision;
            }
          }
        }

        if (earliestCollision) {
          if (earliestCollision.outOfBounds) {
            entity.markedForDeletion = true;
            // outOfBounds = true;
            break;
          }

          if (
            earliestCollision.obstacle &&
            earliestCollision.obstacle.hasComponent(Destroyable)
          ) {
            earliestCollision.obstacle.getComponent(Destroyable).hits--;
          }

          entity.position = {
            x: earliestCollision.position.x,
            y: earliestCollision.position.y,
          };

          vector.x = earliestCollision.resolvement.x;
          vector.y = earliestCollision.resolvement.y;

          timeLeft = earliestCollision.timeLeftAfterCollision;
        } else {
          entity.position.x = entity.position.x + vector.x * timeLeft;
          entity.position.y = entity.position.y + vector.y * timeLeft;
          break;
        }
      }
    }
  }

  clone() {
    return new MoveSystem();
  }
}
