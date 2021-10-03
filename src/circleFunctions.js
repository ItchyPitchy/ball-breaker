import { Destroyable } from "./components/Destroyable";
import { Vector } from "./components/Vector";

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

    if (entity1.hasComponent(Vector) && entity2.hasComponent(Vector)) {
      circleFunctions.resolveCollisionBetweenMovingObjects(entity1, entity2);
    } else if (entity1.hasComponent(Vector)) {
      circleFunctions.resolveCollisionWithStationaryObject(
        { ...entity1, vector: entity1.getComponent(Vector).speed },
        entity2,
        dt
      );
    } else {
      circleFunctions.resolveCollisionWithStationaryObject(
        { ...entity2, speed: entity2.getComponent(Vector) },
        entity1,
        dt
      );
    }
  },
  circleIntersect: (entity1, entity2) => {
    const r1 = entity1.radius;
    const { x: x1, y: y1 } = entity1.position;

    const r2 = entity2.radius;
    const { x: x2, y: y2 } = entity2.position;

    // Calculate the square distance between the two circles
    let squareDistance = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= Math.pow(r1 + r2, 2);
  },
  resolveCollisionBetweenMovingObjects: (entity1, entity2) => {
    const vector1 = entity1.getComponent(Vector);
    const vector2 = entity2.getComponent(Vector);

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
      x: vector1.speed.x - vector2.speed.x,
      y: vector1.speed.y - vector2.speed.y,
    };
    const speed =
      vRelativeVelocity.x * vCollisionNorm.x +
      vRelativeVelocity.y * vCollisionNorm.y;

    if (speed < 0) return;

    vector1.x -= speed * vCollisionNorm.x;
    vector1.y -= speed * vCollisionNorm.y;
    vector2.x += speed * vCollisionNorm.x;
    vector2.y += speed * vCollisionNorm.y;
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

    const dot = movingObject.vector.x * nx + movingObject.vector.y * ny;

    movingObject.vector.x = movingObject.vector.x - 2 * dot * nx;
    movingObject.vector.y = movingObject.vector.y - 2 * dot * ny;

    movingObject.position.x =
      movingObject.position.x + movingObject.vector.x * dt;
    movingObject.position.y =
      movingObject.position.y + movingObject.vector.y * dt;
  },
};
