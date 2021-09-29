import "./assets/style.css";
import Game from "./game.js";

const canvas = document.querySelector("#gameScreen");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let game = new Game(GAME_WIDTH, GAME_HEIGHT, ctx);

let oldTimeStamp;

function gameLoop(timestamp) {
  // dt i sekunder
  let dt = (timestamp - oldTimeStamp) / 1000;
  oldTimeStamp = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(dt);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
