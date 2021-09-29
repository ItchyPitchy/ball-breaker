import { RoundObstacle } from "../entities/RoundObstacle.js";

export class Level {
  constructor(entities, systems, structure, balls) {
    this.entities = entities;
    this.systems = systems;
    this.structure = structure;
    this.balls = balls;
    this.components = [];
  }

  getComponent(type) {
    for (const component of this.components) {
      if (component instanceof type) {
        return component;
      }
    }
  }

  addComponents(...components) {
    for (const component of components) {
      this.components.push(component);
    }
  }

  hasComponent(type) {
    for (const component of this.components) {
      if (component instanceof type) {
        return true;
      }
    }
  }

  removeComponent(type) {
    this.components = this.components.filter(
      (component) => component instanceof type
    );
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
