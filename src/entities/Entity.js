export class Entity {

    constructor() {
        this.components = [];
        this.position = {x: 0, y: 0};
    }

    getComponent(type) {
        for (const component of this.components) {
            if (component instanceof type) {
                return component
            }
        }
    }

    addComponents(...components) {
        for (const component of components) {
            this.components.push(component);
        }
    }

    hasComponent(type) {
        for (const component of this.components) {
            if (component instanceof type) {
                return true
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#00f";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 16, 0, 2 * Math.PI);
        ctx.fill();
    }

}