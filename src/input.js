import Game from "/src/game.js";

export default class InputHandler {

  constructor() {


    this.keys = new Set();
    this.mousePos;

    document.addEventListener("keydown", e => {

      switch(e.keyCode) {

        case 27:
          this.keys.add("esc");
          break;
        case 32:
          this.keys.add("space");
          break;
        case 38:
          this.keys.add("up");
          break;
        case 40:
          this.keys.add("down");
          break;
      }

    });

    document.querySelector("#gameScreen").addEventListener("click", e => {
      this.keys.add("leftClick");
      this.mousePos = {x: e.clientX - 8, y: e.clientY - 8};
    })

    // document.querySelector("#gameScreen").addEventListener("click", function(e) {

    //   game.cannon.shoot({x: e.clientX - 8, y: e.clientY - 8});

    // });
    
  }

  togglePause(game) {

    if (game.gamestate === game.gamestates.PAUSED) {
      game.gamestate = game.gamestates.RUNNING;
    } else if (game.gamestate === game.gamestates.RUNNING) {
      game.gamestate = game.gamestates.PAUSED;
    }

  }

  update(game) {

    if (this.keys.has("esc")) {
      this.togglePause(game);
      this.keys.delete("esc");
    }

    if (this.keys.has("space")) {
      game.start();
      this.keys.delete("space");
    }

    if (this.keys.has("leftClick")) {
      this.keys.delete("leftClick");
    }

  }
}