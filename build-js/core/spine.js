"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spine {
    constructor(data) {
        this.bones = [];
        this.data = data;
    }
    setAnimation(animation) {
        if (this.data.hasAnimation(animation)) {
            this.animation = animation;
            this.resetAnimation();
        }
    }
    resetAnimation() {
    }
    update() {
    }
    draw(renderer) {
    }
}
exports.default = Spine;
//# sourceMappingURL=spine.js.map