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
      // console.log("collidableObjects:", collidableObjects);

      // let collisionCount = 0;
      // const maxCollisions = 3;
      let currentPosition = entity.position;
      let currentSpeed = { x: vector.x, y: vector.y };

      // let outOfBounds = false;
      let timeLeft = 0.016;
      let count = 0;

      while (count < 50) {
        count++;

        let earliestCollision;

        // wall on right
        if (
          currentPosition.x + currentSpeed.x * timeLeft + 16 >=
          game.gameWidth
        ) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs(
                (game.gameWidth - 16 - currentPosition.x) /
                  (currentSpeed.x * timeLeft)
              );
          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  currentPosition.x +
                  currentSpeed.x * (timeLeft - timeLeftAfterCollision),
                y:
                  currentPosition.y +
                  currentSpeed.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: -currentSpeed.x,
                y: currentSpeed.y,
              },
            };
          }
        }

        // wall on left
        if (currentPosition.x + currentSpeed.x * timeLeft - 16 <= 0) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs((currentPosition.x - 16) / (currentSpeed.x * timeLeft));

          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  currentPosition.x +
                  currentSpeed.x * (timeLeft - timeLeftAfterCollision),
                y:
                  currentPosition.y +
                  currentSpeed.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: -currentSpeed.x,
                y: currentSpeed.y,
              },
            };
          }
        }

        // wall on top
        if (currentPosition.y + currentSpeed.y * timeLeft - 16 <= 0) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs((currentPosition.y - 16) / (currentSpeed.y * timeLeft));

          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  currentPosition.x +
                  currentSpeed.x * (timeLeft - timeLeftAfterCollision),
                y:
                  currentPosition.y +
                  currentSpeed.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: currentSpeed.x,
                y: -currentSpeed.y,
              },
            };
          }
        }

        // wall on bottom
        if (
          currentPosition.y + currentSpeed.y * timeLeft - 16 >=
          game.gameHeight
        ) {
          const timeLeftAfterCollision =
            timeLeft -
            timeLeft *
              Math.abs(
                (game.gameHeight - currentPosition.y + 16) /
                  (currentSpeed.y * timeLeft)
              );

          if (
            !earliestCollision ||
            timeLeftAfterCollision > earliestCollision.timeLeftAfterCollision
          ) {
            earliestCollision = {
              position: {
                x:
                  currentPosition.x +
                  currentSpeed.x * (timeLeft - timeLeftAfterCollision),
                y:
                  currentPosition.y +
                  currentSpeed.y * (timeLeft - timeLeftAfterCollision),
              },
              timeLeftAfterCollision,
              resolvement: {
                x: currentSpeed.x,
                y: currentSpeed.y,
              },
              outOfBounds: true,
            };
          }
        }

        for (const object of collidableObjects) {
          if (
            object.markedForDeletion ||
            (object.hasComponent(Destroyable) &&
              object.getComponent(Destroyable).hits <= 0)
          ) {
            continue;
          }

          const collision = collisionFunctions.getCollision(
            currentPosition,
            currentSpeed,
            entity.getComponent(Collidable).restitution,
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

          currentPosition = {
            x: earliestCollision.position.x,
            y: earliestCollision.position.y,
          };

          currentSpeed = {
            x: earliestCollision.resolvement.x,
            y: earliestCollision.resolvement.y,
          };

          timeLeft = earliestCollision.timeLeftAfterCollision;
        } else {
          currentPosition.x = currentPosition.x + currentSpeed.x * timeLeft;
          currentPosition.y = currentPosition.y + currentSpeed.y * timeLeft;
          break;
        }
      }

      entity.position = currentPosition;
      vector.x = currentSpeed.x;
      vector.y = currentSpeed.y;
    }
  }

  clone() {
    return new MoveSystem();
  }
}
