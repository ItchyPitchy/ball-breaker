import InputHandler from "./input.js";
import { CannonBall } from "./entities/CannonBall.js";
import { Cannon } from "./entities/Cannon.js";
import { Level1 } from "./levels/Level1.js";
import { Level2 } from "./levels/Level2.js";
import { Level3 } from "./levels/Level3.js";
import { ShootSystem } from "./systems/ShootSystem.js";
import { MoveSystem } from "./systems/MoveSystem.js";
import { GravitySystem } from "./systems/GravitySystem.js";
import { CollisionSystem } from "./systems/CollisionSystem.js";
import { RoundObstacle } from "./entities/RoundObstacle.js";

// const GAMESTATE = {
//   PAUSED: 0,
//   RUNNING: 1,
//   MENU: 2,
//   GAMEOVER: 3,
//   NEWLEVEL: 4
// }

export default class Game {
  constructor(gameWidth, gameHeight, canvas, ctx) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.ctx = ctx;
    this.gamestates = {
      PAUSED: 0,
      RUNNING: 1,
      MENU: 2,
      GAMEOVER: 3,
      NEWLEVEL: 4,
      WIN: 5,
    };
    this.gamestate = this.gamestates.MENU;

    this.input = new InputHandler(this);

    // this.entities = [
    //   new Cannon({x: this.gameWidth / 2, y: 50}),
    // ];

    // this.systems = [
    //   new ShootSystem(),
    //   new GravitySystem(),
    //   new MoveSystem(),
    //   new CollisionSystem(),
    // ];

    this.levels = [new Level1(this), new Level2(this), new Level3(this)];

    this.currentLevel = 2;
    this.systems = [];
    this.entities = [];
  }

  start() {
    if (
      this.gamestate !== this.gamestates.MENU &&
      this.gamestate !== this.gamestates.NEWLEVEL
    )
      return;
    this.gamestate = this.gamestates.RUNNING;
    this.levels[this.currentLevel].buildLevel(
      this.levels[this.currentLevel].structure,
      this
    );
    this.entities = this.levels[this.currentLevel].entities;
    this.systems = this.levels[this.currentLevel].systems;
  }

  reset() {
    this.levels = [new Level1(this), new Level2(this), new Level3(this)];
    this.currentLevel = 0;
  }

  update(dt) {
    dt = 0.016;

    this.input.update(this);

    if (
      this.gamestate === this.gamestates.PAUSED ||
      this.gamestate === this.gamestates.MENU ||
      this.gamestate === this.gamestates.GAMEOVER ||
      this.gamestate === this.gamestates.NEWLEVEL ||
      this.gamestate === this.gamestates.WIN
    ) {
      return;
    }

    if (
      !this.entities.find((entity) => {
        return entity instanceof RoundObstacle || entity instanceof CannonBall;
      })
    ) {
      if (this.currentLevel + 1 === this.levels.length) {
        this.gamestate = this.gamestates.WIN;
        this.reset();
        setTimeout(() => {
          this.gamestate = this.gamestates.MENU;
        }, 3000);
      } else {
        this.currentLevel++;
        this.gamestate = this.gamestates.NEWLEVEL;
        setTimeout(() => {
          this.start();
        }, 3000);
      }
    } else if (
      this.levels[this.currentLevel].balls === 0 &&
      !this.entities.find((entity) => {
        return entity instanceof CannonBall;
      })
    ) {
      this.gamestate = this.gamestates.GAMEOVER;
      this.reset();
      setTimeout(() => {
        this.gamestate = this.gamestates.MENU;
      }, 3000);
    }

    for (const system of this.systems) {
      const filteredEntities = this.entities.filter(system.appliesTo);
      system.update(filteredEntities, dt, this);
    }

    // this.entities = this.entities.filter(function(brick) {
    //   return !brick.markedForDeletion;
    // });
  }

  draw(ctx) {
    for (const entity of this.entities) {
      entity.draw(ctx);
    }

    if (
      this.gamestate === this.gamestates.PAUSED ||
      this.gamestate === this.gamestates.RUNNING
    ) {
      ctx.font = "30px Arial";
      ctx.fillStyle = "Black";
      ctx.textAlign = "center";
      ctx.fillText(
        `Left: ${this.levels[this.currentLevel].balls}`,
        this.gameWidth - 60,
        this.gameHeight - 10
      );
    }

    if (this.gamestate === this.gamestates.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === this.gamestates.WIN) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "#000";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "center";
      ctx.fillText(
        "Congratulations, you just won the game!!!",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }

    if (this.gamestate === this.gamestates.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "#000";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "center";
      ctx.fillText("Press to start", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === this.gamestates.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "#000";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === this.gamestates.NEWLEVEL) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "#000";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "center";
      ctx.fillText("You won!", this.gameWidth / 2, this.gameHeight / 2);
    }
  }
}
