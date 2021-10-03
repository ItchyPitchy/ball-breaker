import { System } from "./System.js";
import { Cannon } from "../entities/Cannon.js";
import { CannonBall } from "../entities/CannonBall.js";
import { Collidable } from "../components/Collidable.js";
import { collisionFunctions } from "../collisionFunctions.js";

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
            entity.hasComponent(Collidable) && !(entity instanceof CannonBall)
        );

        let outOfBounds = false;
        let collisionCount = 0;
        const maxCollisions = 3;

        while (collisionCount < maxCollisions && !outOfBounds) {
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
              const collision = collisionFunctions.getCollision(
                currentPosition,
                currentSpeed,
                0.95,
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

              game.ctx.beginPath();
              game.ctx.moveTo(currentPosition.x, currentPosition.y);
              game.ctx.lineTo(
                earliestCollision.position.x,
                earliestCollision.position.y
              );
              game.ctx.stroke();

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
              game.ctx.beginPath();
              game.ctx.moveTo(currentPosition.x, currentPosition.y);

              currentPosition.x = currentPosition.x + currentSpeed.x * timeLeft;
              currentPosition.y = currentPosition.y + currentSpeed.y * timeLeft;

              game.ctx.lineTo(currentPosition.x, currentPosition.y);
              game.ctx.stroke();
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

  clone() {
    return new ShootSystem();
  }
}
