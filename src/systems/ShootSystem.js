import { System } from "./System.js";
import { Cannon } from "../entities/Cannon.js";
import { CannonBall } from "../entities/CannonBall.js";
import { CollisionSystem } from "./CollisionSystem.js";
import { circleFunctions } from "../circleFunctions.js";
import { Movable } from "../components/Movable.js";
import { Collidable } from "../components/Collidable.js";

export class ShootSystem extends System {
  constructor(game, level) {
    super();
    this.keys = new Set();
    this.mousePos = { x: game.gameWidth / 2, y: game.gameHeight / 2 };
    this.level = level;
    document.querySelector("#gameScreen").addEventListener("click", (e) => {
      if (
        game.gamestate === game.gamestates.RUNNING &&
        game.currentLevel === this.level
      ) {
        this.keys.add("leftClick");
      }
    });
    document.querySelector("#gameScreen").addEventListener("mousemove", (e) => {
      if (
        game.gamestate === game.gamestates.RUNNING &&
        game.currentLevel === this.level
      ) {
        this.mousePos = {
          x: e.offsetX,
          y: e.offsetY,
        };
      }
    });
  }

  appliesTo(entity) {
    return entity instanceof Cannon;
  }

  update(entities, dt, game) {
    for (const entity of entities) {
      if (
        this.mousePos
        // && !game.entities.find((entity) => entity instanceof Ball)
      ) {
        if (this.mousePos.y < entity.position.y) {
          this.mousePos.y = entity.position.y;
        }

        entity.degrees = this.getDegrees(entity);

        const mousePosDistance = {
          x: this.mousePos.x - entity.position.x,
          y: this.mousePos.y - entity.position.y,
        };

        let mousePosMagnitude = Math.sqrt(
          mousePosDistance.x * mousePosDistance.x +
            mousePosDistance.y * mousePosDistance.y
        );

        if (mousePosMagnitude > 200) {
          mousePosMagnitude = 200;
        }

        if (mousePosMagnitude < 50) {
          mousePosMagnitude = 50;
        }

        const targetDistance = {
          x: Math.cos(entity.degrees) * mousePosMagnitude,
          y: Math.sin(entity.degrees) * mousePosMagnitude,
        };

        let magnitude = Math.sqrt(
          targetDistance.x * targetDistance.x +
            targetDistance.y * targetDistance.y
        );

        const norm = {
          x: targetDistance.x / magnitude,
          y: targetDistance.y / magnitude,
        };

        let speed = { x: norm.x * magnitude * 4, y: norm.y * magnitude * 4 };

        // 50 is the length from the rotate axis to the end of the visual cannon
        const startPosition = {
          x: entity.position.x + 50 * Math.cos(this.getDegrees(entity)),
          y: entity.position.y + 50 * Math.sin(this.getDegrees(entity)),
        };

        if (this.keys.has("leftClick")) {
          game.entities.push(
            new CannonBall({ x: startPosition.x, y: startPosition.y }, 16, {
              x: speed.x,
              y: speed.y,
            })
          );
          game.levels[game.currentLevel].balls--;

          this.keys.delete("leftClick");
        }

        let currentSpeed = speed;
        let currentPosition = startPosition;
        const collidableObjects = game.entities.filter(
          (entity) =>
            entity.hasComponent(Collidable) && !entity.hasComponent(Movable)
        );

        let outOfBounds = false;
        let collisionCount = 0;
        const maxCollisions = 3;

        while (collisionCount < maxCollisions && !outOfBounds) {
          game.ctx.fillStyle = "#000";
          game.ctx.beginPath();
          game.ctx.arc(currentPosition.x, currentPosition.y, 1, 0, 2 * Math.PI);
          game.ctx.fill();

          // add acceleration speed
          currentSpeed.y = currentSpeed.y + 500 * 0.016;

          let timeLeft = 0.016;
          let count = 0;

          while (count < 100) {
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
                timeLeftAfterCollision >
                  earliestCollision.timeLeftAfterCollision
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
                  Math.abs(
                    (currentPosition.x - 16) / (currentSpeed.x * timeLeft)
                  );

              if (
                !earliestCollision ||
                timeLeftAfterCollision >
                  earliestCollision.timeLeftAfterCollision
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
                  Math.abs(
                    (currentPosition.y - 16) / (currentSpeed.y * timeLeft)
                  );

              if (
                !earliestCollision ||
                timeLeftAfterCollision >
                  earliestCollision.timeLeftAfterCollision
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
              currentPosition.y + currentSpeed.y * timeLeft + 16 >=
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
                timeLeftAfterCollision >
                  earliestCollision.timeLeftAfterCollision
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
              const collision = this.getCollision(
                { currentPosition, currentSpeed },
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
              collisionCount++;

              if (earliestCollision.outOfBounds) {
                outOfBounds = true;
                break;
              }

              game.ctx.fillStyle = "red";
              game.ctx.beginPath();
              game.ctx.arc(
                earliestCollision.position.x,
                earliestCollision.position.y,
                3,
                0,
                2 * Math.PI
              );
              game.ctx.fill();

              currentPosition = {
                x: earliestCollision.position.x,
                y: earliestCollision.position.y,
              };

              currentSpeed = {
                x: earliestCollision.resolvement.x,
                y: earliestCollision.resolvement.y,
              };

              if (collisionCount >= maxCollisions) break;

              timeLeft = earliestCollision.timeLeftAfterCollision;
            } else {
              currentPosition.x = currentPosition.x + currentSpeed.x * timeLeft;
              currentPosition.y = currentPosition.y + currentSpeed.y * timeLeft;
              break;
            }
          }
        }
      }
    }
  }
  getDegrees(entity) {
    // if (this.mousePos.y > entity.position.y) {
    if (this.mousePos.x > entity.position.x) {
      const angle = Math.atan(
        Math.abs(this.mousePos.y - entity.position.y) /
          Math.abs(this.mousePos.x - entity.position.x)
      );

      return angle - 0.2 * (Math.PI / 2 - angle);
    } else {
      const angle =
        Math.atan(
          Math.abs(this.mousePos.x - entity.position.x) /
            Math.abs(this.mousePos.y - entity.position.y)
        ) +
        Math.PI / 2;

      return angle + 0.2 * (angle - Math.PI / 2);
    }
    // } else {
    //   if (this.mousePos.x > entity.position.x) {
    //     const angle = -Math.atan(
    //       Math.abs(this.mousePos.y - entity.position.y) /
    //         Math.abs(this.mousePos.x - entity.position.x)
    //     );

    //     return angle;
    //   } else {
    //     const angle =
    //       -Math.atan(
    //         Math.abs(this.mousePos.x - entity.position.x) /
    //           Math.abs(this.mousePos.y - entity.position.y)
    //       ) -
    //       Math.PI / 2;

    //     return angle;
    //   }
    // }
  }
  getCollision({ currentPosition, currentSpeed }, object, time) {
    // Early Escape test: if the length of the movevec is less
    // than distance between the centers of these circles minus
    // their radii, there's no way they can hit.
    const moveVector = {
      x: currentSpeed.x * time,
      y: currentSpeed.y * time,
    };

    const distSquare =
      Math.pow(currentPosition.x - object.position.x, 2) +
      Math.pow(currentPosition.y - object.position.y, 2);

    const sumRadii = 16 + object.radii;
    const moveVectorMag = Math.sqrt(
      Math.pow(moveVector.x, 2) + Math.pow(moveVector.y, 2)
    );

    if (Math.pow(moveVectorMag + sumRadii, 2) <= distSquare) {
      return;
    }

    // Normalize the movevec
    const moveVectorNorm = {
      x: moveVector.x / moveVectorMag,
      y: moveVector.y / moveVectorMag,
    };

    // Find C, the vector from the center of the moving
    // circle A to the center of B
    const vectorC = {
      x: currentPosition.x - object.position.x,
      y: currentPosition.y - object.position.y,
    };

    // Find the length of the vector C
    const lengthC = Math.sqrt(Math.pow(vectorC.x, 2) + Math.pow(vectorC.y, 2));

    // D = N . C = ||C|| * cos(angle between N and C)
    const D = Math.abs(
      moveVectorNorm.x * vectorC.x + moveVectorNorm.y * vectorC.y
    );

    const dontAskMeWhy =
      moveVectorNorm.x * vectorC.x + moveVectorNorm.y * vectorC.y;

    // Another early escape: Make sure that A is moving
    // towards B! If the dot product between the movevec and
    // B.center - A.center is less that or equal to 0,
    // A isn't isn't moving towards B
    if (dontAskMeWhy >= 0) {
      return;
    }

    const F = Math.pow(lengthC, 2) - Math.pow(D, 2);

    // Escape test: if the closest that A will get to B
    // is more than the sum of their radii, there's no
    // way they are going collide
    const sumRadiiSquared = sumRadii * sumRadii;

    if (F >= sumRadiiSquared) {
      return;
    }

    // We now have F and sumRadii, two sides of a right triangle.
    // Use these to find the third side, sqrt(T)
    const T = sumRadiiSquared - F;

    // If there is no such right triangle with sides length of
    // sumRadii and sqrt(f), T will probably be less than 0.
    // Better to check now than perform a square root of a
    // negative number.
    if (T < 0) {
      return;
    }

    // Therefore the distance the circle has to travel along
    // movevec is D - sqrt(T)
    const distance = D - Math.sqrt(T);

    // Finally, make sure that the distance A has to move
    // to touch B is not greater than the magnitude of the
    // movement vector.
    if (moveVectorMag < distance) {
      return;
    }

    // Set the length of the movevec so that the circles will just
    // touch
    const collisionPosition = {
      x: currentPosition.x + moveVectorNorm.x * distance,
      y: currentPosition.y + moveVectorNorm.y * distance,
    };

    // resolve collision
    const distanceBetweenObjects = {
      x: collisionPosition.x - object.position.x,
      y: collisionPosition.y - object.position.y,
    };

    const distanceBetweenObjectsLength = Math.sqrt(
      Math.pow(distanceBetweenObjects.x, 2) +
        Math.pow(distanceBetweenObjects.y, 2)
    );

    const vCollisionNorm = {
      x: distanceBetweenObjects.x / distanceBetweenObjectsLength,
      y: distanceBetweenObjects.y / distanceBetweenObjectsLength,
    };

    // const angle = Math.atan2(
    //   distanceBetweenObjects.y,
    //   distanceBetweenObjects.x
    // );

    const dot =
      currentSpeed.x * vCollisionNorm.x + currentSpeed.y * vCollisionNorm.y;

    const resolvement = {
      x: currentSpeed.x - 2 * dot * vCollisionNorm.x,
      y: currentSpeed.y - 2 * dot * vCollisionNorm.y,
    };

    return {
      position: collisionPosition,
      timeLeftAfterCollision: time - time * (distance / moveVectorMag),
      resolvement,
    };
  }
}
