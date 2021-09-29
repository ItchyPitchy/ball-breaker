import { Level } from "./Level.js";
import { Cannon } from "../entities/Cannon.js";
import { ShootSystem } from "../systems/ShootSystem.js";
import { MoveSystem } from "../systems/MoveSystem.js";
import { GravitySystem } from "../systems/GravitySystem.js";
import { DestroySystem } from "../systems/DestroySystem.js";
import { DeleteSystem } from "../systems/DeleteSystem.js";

export class Level2 extends Level {
  constructor(game) {
    const entities = [new Cannon({ x: game.gameWidth / 2, y: 50 })];
    const systems = [
      new GravitySystem(),
      new MoveSystem(),
      new DestroySystem(),
      new DeleteSystem(),
      new ShootSystem(game, 1),
    ];
    const structure = [
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 3, 0, 1, 0, 1, 0, 3, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 3, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    ];

    super(entities, systems, structure, 10);
  }

  clone(game) {
    const clone = new Level2(game);
    const entities = this.entities.map((entity) => entity.clone());
    const systems = this.system.map((system) => system.clone());
    const components = this.components.map((component) => component.clone());

    clone.structure = this.structure;
    clone.entities = entities;
    clone.systems = systems;

    clone.addComponents(components);

    return clone;
  }
}
