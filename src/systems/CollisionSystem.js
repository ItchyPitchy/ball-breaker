import { System } from "./System.js";
import { Collidable } from "../components/Collidable.js";
import { Movable } from "../components/Movable.js";
import { Destroyable } from "../components/Destroyable.js";

export class CollisionSystem extends System {

  constructor() {
    super()

  }

  appliesTo(entity) {
    return entity.hasComponent(Collidable)

  }

  update(entities, dt, game) {
    
    for (const entity1 of entities) {
      const movable = entity1.getComponent(Movable);

      //wall on right 
      if (entity1.position.x + entity1.radius >= game.gameWidth) {
        entity1.position.x = game.gameWidth - entity1.radius;
        movable.speed.y *= 0.86;
        movable.speed.x *= 0.86;
        movable.speed.x = -movable.speed.x;

      }

      // wall on left
      if (entity1.position.x - entity1.radius <= 0) {
        entity1.position.x = 0 + entity1.radius;
        movable.speed.y *= 0.86;
        movable.speed.x *= 0.86;
        movable.speed.x = -movable.speed.x;

      }

      //wall on bottom
      if (entity1.hasComponent(Movable) && entity1.position.y - entity1.radius >= game.gameHeight) {
        game.entities.splice(game.entities.indexOf(entity1), 1);
        // entity1.position.y = game.gameHeight - entity1.radius;
        // movable.speed.y *= 0.86;
        // movable.speed.x *= 0.86;
        // movable.speed.y = -movable.speed.y;

      }

      // wall on top
      if (entity1.position.y - entity1.radius <= 0) {
        entity1.position.y = 0 + entity1.radius;
        movable.speed.y *= 0.86;
        movable.speed.x *= 0.86;
        movable.speed.y = -movable.speed.y;

      }

      for (const entity2 of entities) {

        if (entity1 !== entity2) {
          const squareDistance = (entity1.position.x-entity2.position.x)*(entity1.position.x-entity2.position.x) + (entity1.position.y-entity2.position.y)*(entity1.position.y-entity2.position.y);

          if (squareDistance <= ((entity1.radius + entity2.radius) * (entity1.radius + entity2.radius))) {
            
            if (entity1.hasComponent(Destroyable)) {
              entity1.getComponent(Destroyable).hits = entity1.getComponent(Destroyable).hits - 1;
            }

            if (!entity1.hasComponent(Movable)) {
              const movable = entity2.getComponent(Movable);

              const distanceBetweenObjects = {x: entity2.position.x - entity1.position.x, y: entity2.position.y - entity1.position.y};
              const angle = Math.atan(distanceBetweenObjects.y / distanceBetweenObjects.x) - Math.PI / 2;
              const nx = -(Math.sin(angle));
              const ny = Math.cos(angle);
              const dot = movable.speed.x * nx + movable.speed.y * ny;
              
              const radii = entity1.radius + entity2.radius;
              let entity2ColliPos;

              if (entity1.position.x <= entity2.position.x) {
                entity2ColliPos = {x: entity1.position.x - Math.cos(angle - Math.PI / 2) * radii, y: entity1.position.y - Math.sin(angle - Math.PI / 2) * radii};

              } else {
                entity2ColliPos = {x: entity1.position.x + Math.cos(angle - Math.PI / 2) * radii, y: entity1.position.y + Math.sin(angle - Math.PI / 2) * radii};

              }

              // entity2.position.x = entity2ColliPos.x;
              // entity2.position.y = entity2ColliPos.y;
              movable.speed.x = movable.speed.x - 2 * dot * nx;
              movable.speed.y = movable.speed.y - 2 * dot * ny;
              entity2.position.x = entity2.position.x + movable.speed.x * dt;
              entity2.position.y = entity2.position.y + movable.speed.y * dt;

            } else if (!entity2.hasComponent(Movable)) {
              const movable = entity1.getComponent(Movable);

              const distanceBetweenObjects = {x: entity1.position.x - entity2.position.x, y: entity1.position.y - entity2.position.y};
              const angle = Math.atan(distanceBetweenObjects.y / distanceBetweenObjects.x) - Math.PI / 2;
              const nx = -(Math.sin(angle));
              const ny = Math.cos(angle);
              const dot = movable.speed.x * nx + movable.speed.y * ny;
              
              const radii = entity1.radius + entity2.radius;
              let entity1ColliPos;

              if (entity1.position.x >= entity2.position.x) {
                entity1ColliPos = {x: entity2.position.x - Math.cos(angle - Math.PI / 2) * radii, y: entity2.position.y - Math.sin(angle - Math.PI / 2) * radii};

              } else {
                entity1ColliPos = {x: entity2.position.x + Math.cos(angle - Math.PI / 2) * radii, y: entity2.position.y + Math.sin(angle - Math.PI / 2) * radii};

              }

              // entity1.position.x = entity1ColliPos.x;
              // entity1.position.y = entity1ColliPos.y;
              movable.speed.x = movable.speed.x - 2 * dot * nx;
              movable.speed.y = movable.speed.y - 2 * dot * ny;
              entity1.position.x += movable.speed.x;
              entity1.position.y += movable.speed.y;

            } else {
              const movable1 = entity1.getComponent(Movable);
              const movable2 = entity2.getComponent(Movable);
              
              const vCollision = {x: entity2.position.x - entity1.position.x, y: entity2.position.y - entity1.position.y};
              const distance = Math.sqrt((entity2.position.x-entity1.position.x) * (entity2.position.x-entity1.position.x) + (entity2.position.y-entity1.position.y) * (entity2.position.y-entity1.position.y));
              const vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
              const vRelativeVelocity = {x: movable1.speed.x - movable2.speed.x, y: movable1.speed.y - movable2.speed.y};
              const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
            
              if (speed < 0) break

              movable1.speed.x -= (speed * vCollisionNorm.x);
              movable1.speed.y -= (speed * vCollisionNorm.y);
              movable2.speed.x += (speed * vCollisionNorm.x);
              movable2.speed.y += (speed * vCollisionNorm.y);

            }
          }
        }
      }
    }
  }
}