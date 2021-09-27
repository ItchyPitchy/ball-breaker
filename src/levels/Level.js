import { CannonBall } from "../entities/CannonBall.js";
import { RoundObstacle } from "../entities/RoundObstacle.js";

export class Level {
  constructor() {
    this.entities = [];
    this.systems = [];
    this.structure = [];
  }

  buildLevel(structure, game) {
    structure.forEach((row, rowIndex) => {
      row.forEach((obstacle, obstacleIndex) => {
        if (obstacle > 0) {
          let position = {
            x: (game.gameWidth / (row.length + 1)) * (obstacleIndex + 1),
            y:
              ((game.gameHeight - 100) / (structure.length + 1)) *
                (rowIndex + 1) +
              100,
          };
          this.entities.push(
            new RoundObstacle(position, 16 * obstacle, obstacle)
          );
        }
      });
    });
  }
}
