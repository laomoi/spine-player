"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sprite_1 = require("../webgl/sprite");
class TestSprite {
    constructor() {
        this._inited = false;
        this.meshes = [];
    }
    init(renderer) {
        let sprite1 = new sprite_1.default(renderer);
        sprite1.setImage("skeleton.png");
        sprite1.x = 100;
        sprite1.y = 100;
        this.meshes.push(sprite1);
        let sprite2 = new sprite_1.default(renderer);
        sprite2.setImage("skeleton.png");
        sprite2.x = 200;
        sprite2.y = 200;
        this.meshes.push(sprite2);
        renderer.enableBlend();
        renderer.setAlphaBlendMode();
        this._inited = true;
    }
    run(renderer) {
        if (!this._inited) {
            this.init(renderer);
        }
        renderer.clear();
        for (let mesh of this.meshes) {
            mesh.x += 1;
            if (mesh.x >= 400) {
                mesh.x = 0;
            }
        }
        for (let mesh of this.meshes) {
            mesh.draw();
        }
    }
}
exports.default = TestSprite;
//# sourceMappingURL=test-sprite.js.map