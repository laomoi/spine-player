"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("./mesh");
class Sprite extends mesh_1.default {
    preDraw() {
        if (this.indices == null) {
            this.points = [
                [0, this.texture.imageHeight, 0, 1],
                [0, 0, 0, 0],
                [this.texture.imageWidth, this.texture.imageHeight, 1, 1],
                [this.texture.imageWidth, 0, 1, 0],
            ];
            this.indices = new Uint16Array([
                0, 1, 2,
                1, 3, 2
            ]);
        }
    }
}
exports.default = Sprite;
//# sourceMappingURL=sprite.js.map