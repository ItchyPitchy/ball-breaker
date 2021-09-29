export class Destroyable {
  constructor(hits) {
    this.hits = hits;
  }

  clone() {
    return new Destroyable(this.hits);
  }
}
