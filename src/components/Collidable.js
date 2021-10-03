export class Collidable {
  constructor(restitution) {
    this.shape;
    this.restitution = restitution;
  }

  clone() {
    return new Collidable(this.restitution);
  }
}
