export class Collidable {
  constructor() {
    this.shape;
  }

  clone() {
    return new Collidable(this.shape);
  }
}
