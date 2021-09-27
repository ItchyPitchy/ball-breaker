import { Destroyable } from "./components/Destroyable";
import { Movable } from "./components/Movable";

export const circleFunctions = {
  resolveCollision: (entity1, entity2, dt, game) => {
    if (
      [entity1, entity2].find(
        (entity) =>
          entity.hasComponent(Destroyable) &&
          entity.getComponent(Destroyable).hits <= 0
      )
    ) {
      return;
    }

    if (entity1.hasComponent(Movable) && entity2.hasComponent(Movable)) {
      circleFunctions.resolveCollisionBetweenMovingObjects(entity1, entity2);
    } else if (entity1.hasComponent(Movable)) {
      circleFunctions.resolveCollisionWithStationaryObject(
        { ...entity1, speed: entity1.getComponent(Movable).speed },
        entity2,
        dt
      );
    } else {
      circleFunctions.resolveCollisionWithStationaryObject(
        { ...entity2, speed: entity2.getComponent(Movable).speed },
        entity1,
        dt
      );
    }
  },
  circleIntersect: (entity1, entity2) => {
    const r1 = entity1.radii;
    const { x: x1, y: y1 } = entity1.position;

    const r2 = entity2.radii;
    const { x: x2, y: y2 } = entity2.position;

    // Calculate the square distance between the two circles
    let squareDistance = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= Math.pow(r1 + r2, 2);
  },
  resolveCollisionBetweenMovingObjects: (entity1, entity2) => {
    const movable1 = entity1.getComponent(Movable);
    const movable2 = entity2.getComponent(Movable);

    const vCollision = {
      x: entity2.position.x - entity1.position.x,
      y: entity2.position.y - entity1.position.y,
    };
    const distance = Math.sqrt(
      (entity2.position.x - entity1.position.x) *
        (entity2.position.x - entity1.position.x) +
        (entity2.position.y - entity1.position.y) *
          (entity2.position.y - entity1.position.y)
    );
    const vCollisionNorm = {
      x: vCollision.x / distance,
      y: vCollision.y / distance,
    };
    const vRelativeVelocity = {
      x: movable1.speed.x - movable2.speed.x,
      y: movable1.speed.y - movable2.speed.y,
    };
    const speed =
      vRelativeVelocity.x * vCollisionNorm.x +
      vRelativeVelocity.y * vCollisionNorm.y;

    if (speed < 0) return;

    movable1.speed.x -= speed * vCollisionNorm.x;
    movable1.speed.y -= speed * vCollisionNorm.y;
    movable2.speed.x += speed * vCollisionNorm.x;
    movable2.speed.y += speed * vCollisionNorm.y;
  },
  resolveCollisionWithStationaryObject: (
    movingObject,
    stationaryObject,
    dt
  ) => {
    const distanceBetweenObjects = {
      x: movingObject.position.x - stationaryObject.position.x,
      y: movingObject.position.y - stationaryObject.position.y,
    };

    const angle =
      Math.atan(distanceBetweenObjects.y / distanceBetweenObjects.x) -
      Math.PI / 2;

    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);

    const dot = movingObject.speed.x * nx + movingObject.speed.y * ny;

    movingObject.speed.x = movingObject.speed.x - 2 * dot * nx;
    movingObject.speed.y = movingObject.speed.y - 2 * dot * ny;

    movingObject.position.x =
      movingObject.position.x + movingObject.speed.x * dt;
    movingObject.position.y =
      movingObject.position.y + movingObject.speed.y * dt;
  },
};
