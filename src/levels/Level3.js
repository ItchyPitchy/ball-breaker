import { Level } from "./Level.js";
import { Cannon } from "../entities/Cannon.js";
import { ShootSystem } from "../systems/ShootSystem.js";
import { MoveSystem } from "../systems/MoveSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { GravitySystem } from "../systems/GravitySystem.js";
import { DestroySystem } from "../systems/DestroySystem.js";

export class Level3 extends Level {

  constructor(game) {
    super();
    this.structure = [
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1],
      [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    ];
    this.balls = 8;
    this.entities = [
      new Cannon({x: game.gameWidth / 2, y: 20}),
    ]

    this.systems = [
      new ShootSystem(game, 2),
      new GravitySystem(),
      new MoveSystem(),
      new CollisionSystem(),
      new DestroySystem(),
    ]
  }
}