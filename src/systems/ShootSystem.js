import { System } from "./System.js";
import { Cannon } from "../entities/Cannon.js";
import { CannonBall } from "../entities/CannonBall.js";
import { AimDot } from "../entities/AimDot.js";
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
    game.entities = game.entities.filter(
      (entity) => !(entity instanceof AimDot)
    );

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

        // 50 is the length from the rotate axis to the visual cannon
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

        // let previousPos;
        // let currentTime = 0;
        let currentSpeed = speed;
        let currentPosition = startPosition;
        // const currentPos = {
        //   x: currentPosition.x + currentSpeed.x * currentTime,
        //   y: currentPosition.y + currentSpeed.y * currentTime,
        // };
        const collidableObjects = game.entities.filter(
          (entity) =>
            entity.hasComponent(Collidable) && !entity.hasComponent(Movable)
        );

        let outOfBounds = false;
        // let collided = false;

        for (let i = 0; i < 2; i++) {
          if (outOfBounds) break;

          // collided = false;

          while (true) {
            // if (collided) break;

            game.ctx.fillStyle = "#000";
            game.ctx.beginPath();
            game.ctx.arc(
              currentPosition.x,
              currentPosition.y,
              1,
              0,
              2 * Math.PI
            );
            game.ctx.fill();

            console.log("currentPosition:", currentPosition);
            console.log("currentSpeed:", currentSpeed);

            // add acceleration speed
            currentSpeed.y = currentSpeed.y + 500 * 0.016;

            // move object based on speed
            currentPosition = {
              x: currentPosition.x + currentSpeed.x * 0.016,
              y: currentPosition.y + currentSpeed.y * 0.016,
            };

            // wall on right
            if (currentPosition.x + 16 >= game.gameWidth) {
              currentPosition.x = game.gameWidth - 16;
              currentSpeed.x = -currentSpeed.x;
              break;
            }

            // wall on left
            if (currentPosition.x - 16 <= 0) {
              currentPosition.x = 0 + 16;
              speed.x = -speed.x;
              break;
            }

            // wall on top
            if (currentPosition.y - 16 <= 0) {
              currentPosition.y = 0 + 16;
              speed.y = -speed.y;
              break;
            }

            // wall on bottom
            if (currentPosition.y - 16 >= game.gameHeight) {
              outOfBounds = true;
              break;
            }

            let collided = false;

            for (const object of collidableObjects) {
              if (
                circleFunctions.circleIntersect(
                  { position: currentPosition, radii: 16 },
                  object
                )
              ) {
                const distanceBetweenObjects = {
                  x: currentPosition.x - object.position.x,
                  y: currentPosition.y - object.position.y,
                };

                const angle =
                  Math.atan(
                    distanceBetweenObjects.y / distanceBetweenObjects.x
                  ) -
                  Math.PI / 2;

                const nx = -Math.sin(angle);
                const ny = Math.cos(angle);

                const dot = currentSpeed.x * nx + currentSpeed.y * ny;

                currentSpeed.x = currentSpeed.x - 2 * dot * nx;
                currentSpeed.y = currentSpeed.y - 2 * dot * ny;

                game.ctx.fillStyle = "red";
                game.ctx.beginPath();
                game.ctx.arc(
                  currentPosition.x,
                  currentPosition.y,
                  1,
                  0,
                  2 * Math.PI
                );
                game.ctx.fill();

                currentPosition.x = currentPosition.x + currentSpeed.x * 0.016;
                currentPosition.y = currentPosition.y + currentSpeed.y * 0.016;

                collided = true;
              }
            }

            if (collided) break;
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
}
