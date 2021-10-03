import { Collidable } from "./components/Collidable";
import { Vector } from "./components/Vector";

export const collisionFunctions = {
  getCollision: (entity, obstacle, time) => {
    const vector = entity.getComponent(Vector);
    // Early Escape test: if the length of the movevec is less
    // than distance between the centers of these circles minus
    // their radii, there's no way they can hit.
    const moveVector = {
      x: vector.x * time,
      y: vector.y * time,
    };

    // const distanceBetweenObjects = entity.distanceTo(obstacle);
    const distSquare =
      Math.pow(entity.position.x - obstacle.position.x, 2) +
      Math.pow(entity.position.y - obstacle.position.y, 2);

    const sumRadii = entity.radii + obstacle.radii;

    const moveVectorMag = Math.sqrt(
      Math.pow(moveVector.x, 2) + Math.pow(moveVector.y, 2)
    );

    if (Math.pow(moveVectorMag + sumRadii, 2) <= distSquare) {
      return;
    }

    // Normalize the movevec
    const moveVectorNorm = {
      x: moveVector.x / moveVectorMag,
      y: moveVector.y / moveVectorMag,
    };

    // Find C, the vector from the center of the moving
    // circle A to the center of B
    const vectorC = {
      x: obstacle.position.x - entity.position.x,
      y: obstacle.position.y - entity.position.y,
    };

    // Find the length of the vector C
    const lengthC = Math.sqrt(Math.pow(vectorC.x, 2) + Math.pow(vectorC.y, 2));

    // D = N . C = ||C|| * cos(angle between N and C)
    const D = moveVectorNorm.x * vectorC.x + moveVectorNorm.y * vectorC.y;

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

    // Set the length of the movevec so that the circles will just
    // touch
    const collisionPosition = {
      x: entity.position.x + moveVectorNorm.x * distance,
      y: entity.position.y + moveVectorNorm.y * distance,
    };

    // resolve collision
    const vCollision = {
      x: collisionPosition.x - obstacle.position.x,
      y: collisionPosition.y - obstacle.position.y,
    };

    const distanceBetweenObjectsLength = Math.sqrt(
      Math.pow(vCollision.x, 2) + Math.pow(vCollision.y, 2)
    );

    const vCollisionNorm = {
      x: vCollision.x / distanceBetweenObjectsLength,
      y: vCollision.y / distanceBetweenObjectsLength,
    };

    const dot = vector.x * vCollisionNorm.x + vector.y * vCollisionNorm.y;

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
