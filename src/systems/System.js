export class System {
  appliesTo(entity) {
    return false;
  }

  update(entities, dt, game) {
    throw new Error("not implemented");
  }
}
