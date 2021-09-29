export class Physical {
  constructor(fallSpeed) {
    this.fallSpeed = fallSpeed;
  }

  clone() {
    return new Physical(this.fallSpeed);
  }
}
