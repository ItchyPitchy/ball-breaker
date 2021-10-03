import { Collidable } from "./components/Collidable";
import { Vector } from "./components/Vector";
import { Entity } from "./entities/Entity";

export const collisionFunctions = {
  getCollision: (entity, obstacle, time) => {
    const vector = entity.getComponent(Vector);
    // Early Escape test: if the length of the movevec is less
    // than distance between the centers of these circles minus
    // their radii, there's no way they can hit.
    const moveVector = new Vector(vector.x * time, vector.y * time);

    const distanceBetweenObjects = entity.distanceTo(obstacle);

    const sumRadii = entity.radii + obstacle.radii;

    const moveVectorMag = moveVector.magnitude();

    if (moveVectorMag + sumRadii <= distanceBetweenObjects) {
      return;
    }

    // Normalize the movevec
    const moveVectorNorm = moveVector.norm();

    // Find C, the vector from the center of the moving
    // circle A to the center of B
    const vectorC = obstacle.vectorTo(entity);

    // Find the length of the vector C
    const lengthC = vectorC.magnitude();

    // D = N . C = ||C|| * cos(angle between N and C)
    const D = vectorC.dot(moveVectorNorm);

    // Another early escape: Make sure that A is moving
    // towards B! If the dot product between the movevec and
    // B.center - A.center is less that or equal to 0,
    // A isn't isn't moving towards B
    if (D <= 0) {
      return;
    }

    const F = Math.pow(lengthC, 2) - Math.pow(D, 2);

    // Escape test: if the closest that A will get to B
    // is more than the sum of their radii, there's no
    // way they are going collide
    const sumRadiiSquared = sumRadii * sumRadii;

    if (F >= sumRadiiSquared) {
      return;
    }

    // We now have F and sumRadii, two sides of a right triangle.
    // Use these to find the third side, sqrt(T)
    const T = sumRadiiSquared - F;

    // If there is no such right triangle with sides length of
    // sumRadii and sqrt(f), T will probably be less than 0.
    // Better to check now than perform a square root of a
    // negative number.
    if (T < 0) {
      return;
    }

    // Therefore the distance the circle has to travel along
    // movevec is D - sqrt(T)
    const distance = D - Math.sqrt(T);

    // Finally, make sure that the distance A has to move
    // to touch B is not greater than the magnitude of the
    // movement vector.
    if (moveVectorMag < distance) {
      return;
    }

    // resolve collision
    const collisionPosition = {
      x: entity.position.x + moveVectorNorm.x * distance,
      y: entity.position.y + moveVectorNorm.y * distance,
    };
    const tempEntity = new Entity(collisionPosition);
    const vCollision = tempEntity.vectorTo(obstacle);
    const vCollisionNorm = vCollision.norm();
    const dot = vector.dot(vCollisionNorm);

    const resolvement = {
      x:
        (vector.x - 2 * dot * vCollisionNorm.x) *
        Math.min(
          entity.getComponent(Collidable).restitution,
          obstacle.getComponent(Collidable).restitution
        ),
      y:
        (vector.y - 2 * dot * vCollisionNorm.y) *
        Math.min(
          entity.getComponent(Collidable).restitution,
          obstacle.getComponent(Collidable).restitution
        ),
    };

    return {
      position: collisionPosition,
      timeLeftAfterCollision: time - time * (distance / moveVectorMag),
      resolvement,
      obstacle,
    };
  },
};
