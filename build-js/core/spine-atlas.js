"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const texture_1 = require("../webgl/texture");
const fs = require("fs");
const path = require("path");
class SpineAtlas {
    constructor(atlas, png, renderer) {
        this.texture = texture_1.default.getTexture(png, renderer);
        let atlasContent = fs.readFileSync(path.join(__dirname, "../../res/" + atlas));
    }
}
exports.default = SpineAtlas;
//# sourceMappingURL=spine-atlas.js.map