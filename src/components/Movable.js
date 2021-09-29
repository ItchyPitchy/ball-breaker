export class Movable {
  constructor(speed) {
    this.speed = speed;
  }

  clone() {
    return new Movable(this.speed);
  }
}
