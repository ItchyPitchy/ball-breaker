export function detectCollision(ball, gameObject) {
  const topOfBall = ball.position.y;
  const bottomOfBall = ball.position.y + ball.size;

  const topOfObject = gameObject.position.y;
  const leftSideOfObject = gameObject.position.x;
  const rightSideOfObject = gameObject.position.x + gameObject.width;
  const bottomOfObject = gameObject.position.y + gameObject.height;

  //collision with paddle
  if (
    bottomOfBall >= topOfObject &&
    topOfBall <= bottomOfObject &&
    ball.position.x + ball.size >= leftSideOfObject &&
    ball.position.x <= rightSideOfObject
  ) {
    return true;
  } else {
    return false;
  }
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
  // Calculate the distance between the two circles
  let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap
  return squareDistance <= (r1 + r2) * (r1 + r2);
}
export function detectCollisions(gameObjects) {
  let obj1;
  let obj2;

  // Reset collision state of all objects
  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].isColliding = false;
  }

  // Start checking for collisions
  for (let i = 0; i < gameObjects.length; i++) {
    obj1 = gameObjects[i];

    for (let j = i + 1; j < gameObjects.length; j++) {
      obj2 = gameObjects[j];

      // Compare object1 with object2
      if (
        circleIntersect(
          obj1.position.x,
          obj1.position.y,
          obj1.radii,
          obj2.position.x,
          obj2.position.y,
          obj2.radii
        )
      ) {
        obj1.isColliding = true;
        obj2.isColliding = true;

        if (obj1.stationary) {
          const distanceBetweenObjects = {
            x: obj2.position.x - obj1.position.x,
            y: obj2.position.y - obj1.position.y,
          };
          const angle1 =
            Math.atan(distanceBetweenObjects.y / distanceBetweenObjects.x) -
            Math.PI / 2;
          const nx = -Math.sin(angle1);
          const ny = Math.cos(angle1);
          const dot = obj2.speed.x * nx + obj2.speed.y * ny;

          const radiis = obj1.radii + obj2.radii;
          let obj2ColliPos;

          if (obj1.position.x <= obj2.position.x) {
            obj2ColliPos = {
              x: obj1.position.x - Math.cos(angle1 - Math.PI / 2) * radiis,
              y: obj1.position.y - Math.sin(angle1 - Math.PI / 2) * radiis,
            };
          } else {
            obj2ColliPos = {
              x: obj1.position.x + Math.cos(angle1 - Math.PI / 2) * radiis,
              y: obj1.position.y + Math.sin(angle1 - Math.PI / 2) * radiis,
            };
          }

          // const distanceBetweenObjects = {x: obj2.position.x - obj1.position.x, y: obj2.position.y - obj1.position.y};
          // const angle1 = Math.atan2(distanceBetweenObjects.x, -(distanceBetweenObjects.y)) - Math.PI / 2;
          // const distanceToCollision = {x: Math.cos(angle1) * obj1.radii, y: Math.sin(angle1) * obj1.radii};
          // const collisionPos = {x: obj1.position.x - distanceToCollision.x, y: obj1.position.y - distanceToCollision.y};

          // const hypo = Math.sqrt(obj2.speed.x * obj2.speed.x + obj2.speed.y * obj2.speed.y);
          // const angle2 = Math.asin(obj2.speed.y / hypo);
          // const angle3 = Math.PI - angle1 - angle2;

          // obj2.position.x = collisionPos.x;
          // obj2.position.y = collisionPos.y;
          // console.log(obj2.position.x, obj2.position.y);

          // obj2.speed.x = Math.sin(angle3) * hypo;
          // obj2.speed.y = Math.cos(angle3) * hypo;
          // console.log(obj2.speed.x, obj2.speed.y);

          // let vCollision = {x: obj1.position.x - obj2.position.x, y: obj1.position.y - obj2.position.y};
          // let distance = Math.sqrt((obj2.position.x-obj1.position.x)*(obj2.position.x-obj1.position.x) + (obj2.position.y-obj1.position.y)*(obj2.position.y-obj1.position.y));
          // let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
          // let vRelativeVelocity = {x: -obj2.speed.x, y: -obj2.speed.y};
          // // let speed = Math.sqrt(obj2.speed.x * obj2.speed.x + obj2.speed.y * obj2.speed.y);
          // let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

          // console.log("speed: " + speed);

          // if (dot == 0) {

          //   break;

          // }

          obj2.position.x = obj2ColliPos.x;
          obj2.position.y = obj2ColliPos.y;
          console.log(obj2.speed.x);
          console.log(obj2.speed.y);
          obj2.speed.x = obj2.speed.x - 2 * dot * nx;
          obj2.speed.y = obj2.speed.y - 2 * dot * ny;
          console.log(obj2.speed.x);
          console.log(obj2.speed.y);
        } else if (obj2.stationary) {
          const distanceBetweenObjects = {
            x: obj1.position.x - obj2.position.x,
            y: obj1.position.y - obj2.position.y,
          };
          // const angle1 = (Math.atan2(distanceBetweenObjects.x, -(distanceBetweenObjects.y)) - Math.PI / 2);
          const angle1 =
            Math.atan(distanceBetweenObjects.y / distanceBetweenObjects.x) -
            Math.PI / 2;
          const nx = -Math.sin(angle1);
          const ny = Math.cos(angle1);
          const dot = obj1.speed.x * nx + obj1.speed.y * ny;
          // console.log(`angle1: ${angle1}`)
          // const distanceToCollision = {x: Math.sin(angle1) * obj2.radii, y: Math.cos(angle1) * obj2.radii};
          // const collisionPos = {x: obj2.position.x - distanceToCollision.x, y: obj2.position.y - distanceToCollision.y};
          // console.log(distanceToCollision)
          // const hypo = Math.sqrt(obj1.speed.x * obj1.speed.x + obj1.speed.y * obj1.speed.y);
          // console.log(`hypo: ${hypo}`)
          // const angle2 = Math.asin(obj1.speed.y / hypo);
          // console.log(`angle2: ${angle2}`)
          // const angle3 = Math.PI - angle1 - angle2;

          // let vCollision = {x: obj2.position.x - obj1.position.x, y: obj2.position.y - obj1.position.y};
          // console.log("vCollision: " + vCollision.x + " " + vCollision.y);

          // let distance = Math.sqrt((obj2.position.x-obj1.position.x)*(obj2.position.x-obj1.position.x) + (obj2.position.y-obj1.position.y)*(obj2.position.y-obj1.position.y));
          // console.log("distance: " + distance);

          // let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
          // console.log("vCollisionNorm: " + vCollisionNorm.x + " " + vCollisionNorm.y);

          // let vRelativeVelocity = {x: obj1.speed.x, y: obj1.speed.y};
          // console.log("vRelativeVelocity: " + vRelativeVelocity.x + " " + vRelativeVelocity.y);

          // let speed = Math.sqrt(obj1.speed.x * obj1.speed.x + obj1.speed.y * obj1.speed.y);
          // // let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
          // console.log("speed: " + speed);

          // if (dot == 0) {

          //   break;

          // }

          const radiis = obj1.radii + obj2.radii;
          let obj2ColliPos;

          if (obj1.position.x >= obj2.position.x) {
            obj2ColliPos = {
              x: obj2.position.x - Math.cos(angle1 - Math.PI / 2) * radiis,
              y: obj2.position.y - Math.sin(angle1 - Math.PI / 2) * radiis,
            };
          } else {
            obj2ColliPos = {
              x: obj2.position.x + Math.cos(angle1 - Math.PI / 2) * radiis,
              y: obj2.position.y + Math.sin(angle1 - Math.PI / 2) * radiis,
            };
          }

          // obj1.position.x = obj2ColliPos.x;
          // obj1.position.y = obj2ColliPos.y;
          console.log(obj1.speed.x);
          console.log(obj1.speed.y);
          obj1.speed.x = obj1.speed.x - 2 * dot * nx;
          obj1.speed.y = obj1.speed.y - 2 * dot * ny;
          console.log(obj1.speed.x);
          console.log(obj1.speed.y);
        } else {
          let vCollision = {
            x: obj2.position.x - obj1.position.x,
            y: obj2.position.y - obj1.position.y,
          };
          let distance = Math.sqrt(
            (obj2.position.x - obj1.position.x) *
              (obj2.position.x - obj1.position.x) +
              (obj2.position.y - obj1.position.y) *
                (obj2.position.y - obj1.position.y)
          );
          let vCollisionNorm = {
            x: vCollision.x / distance,
            y: vCollision.y / distance,
          };
          let vRelativeVelocity = {
            x: obj1.speed.x - obj2.speed.x,
            y: obj1.speed.y - obj2.speed.y,
          };
          let speed =
            vRelativeVelocity.x * vCollisionNorm.x +
            vRelativeVelocity.y * vCollisionNorm.y;

          if (speed < 0) {
            break;
          }

          obj1.speed.x -= speed * vCollisionNorm.x;
          obj1.speed.y -= speed * vCollisionNorm.y;
          obj2.speed.x += speed * vCollisionNorm.x;
          obj2.speed.y += speed * vCollisionNorm.y;
        }
      }
    }
  }
}
